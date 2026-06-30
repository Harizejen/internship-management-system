import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      role?: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Student ID or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) return null;

        const input = credentials.identifier as string;

        // 1. Attempt to look up the user directly by their Institutional Email
        let user = await prisma.user.findUnique({
          where: { email: input },
          include: { studentProfile: true },
        });

        // 2. If no email matches, check if they typed their raw Student ID instead
        if (!user) {
          const profile = await prisma.studentProfile.findUnique({
            where: { matricId: input },
            include: { user: { include: { studentProfile: true } } },
          });

          if (profile) {
            user = profile.user;
          }
        }

        // 3. System Validation Gate
        if (user) {
          // During the pilot phase, we accept their student ID as the password.
          // We check if the typed password matches their matricId or a default fallback.
          const expectedPassword =
            user.studentProfile?.matricId || "password123";

          if (credentials.password === expectedPassword) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Routes authentication errors straight back to our clean URL layout
  },
});
