import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.id && token?.role) {
        session.user.id = token.id as string;
        session.user.role = token.role as "AGENT" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
