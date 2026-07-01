import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "onboarding@resend.dev", // Must use this exact string on the Resend free tier
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Student ID or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) return null;

        const input = credentials.identifier as string;

        // 1. First Pass: Check by Email address
        let user = await prisma.user.findUnique({
          where: { email: input },
          include: { studentProfile: true, academicProfile: true },
        });

        // 2. Second Pass: Check if input matches an Academic Supervisor's Profile Staff ID
        if (!user) {
          const acadProfile = await prisma.academicSupervisorProfile.findUnique(
            {
              where: { staffId: input },
              include: {
                user: {
                  include: { studentProfile: true, academicProfile: true },
                },
              },
            },
          );

          if (acadProfile) {
            user = acadProfile.user;
          }
        }

        // 3. Third Pass: Check if input matches a Student's Matric ID
        if (!user) {
          const studentProfile = await prisma.studentProfile.findUnique({
            where: { matricId: input },
            include: {
              user: {
                include: { studentProfile: true, academicProfile: true },
              },
            },
          });

          if (studentProfile) {
            user = studentProfile.user;
          }
        }

        // 3. System Validation Gate
        if (user) {
          let expectedPassword = "password123"; // Admin or universal backup template

          if (user.role === "STUDENT" && user.studentProfile?.matricId) {
            expectedPassword = user.studentProfile.matricId;
          } else if (
            user.role === "ACADEMIC_SUPERVISOR" &&
            user.academicProfile?.staffId
          ) {
            expectedPassword = user.academicProfile.staffId; // Lecturer password = Staff ID
          }

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
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Routes authentication errors straight back to our clean URL layout
  },
});
