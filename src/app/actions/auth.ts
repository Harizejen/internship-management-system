"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  if (!identifier || !password) {
    return { error: "Please fill in all layout credentials fields." };
  }

  try {
    // Trigger our custom flexible authorize function inside src/auth.ts
    await signIn("credentials", {
      identifier: identifier as string,
      password: password as string,
      redirectTo: "/dashboard", // Route successful entries directly to the core dashboard
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials. Check your ID/Email or Password.",
          };
        default:
          return { error: "An unexpected system security error occurred." };
      }
    }

    // Crucial Next.js 15 Rule: Re-throw redirect errors so the framework can process the navigation
    throw error;
  }
}
