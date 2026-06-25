"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/clients",
    });
    return {};
  } catch (error) {
    // next/navigation redirect throws — must rethrow it
    if (
      error instanceof Error &&
      (error.message === "NEXT_REDIRECT" || error.message.includes("NEXT_REDIRECT"))
    ) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        case "CallbackRouteError":
          return { error: "Invalid email or password." };
        default:
          return {
            error: `Auth error (${error.type}). Check AUTH_SECRET and AUTH_URL are set in Railway Variables.`,
          };
      }
    }
    console.error("Login error:", error);
    return { error: "Server error. Check deploy logs." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
