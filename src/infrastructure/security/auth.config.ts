import type { NextAuthConfig } from "next-auth";
import { Role } from "@/shared/types/role";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name: string;
      email: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

/**
 * Edge-safe base config (session strategy, pages, jwt/session callbacks).
 * Deliberately has NO providers here: the Credentials provider touches
 * Mongoose/node:crypto through MongoUserRepository, which cannot be bundled
 * into src/middleware.ts (Edge Runtime). The Node-only provider is added on
 * top of this config in auth.ts, which is never imported by middleware.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
