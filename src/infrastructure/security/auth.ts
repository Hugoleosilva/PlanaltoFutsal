import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { comparePassword } from "./password-hasher";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";

const userRepository = new MongoUserRepository();

/**
 * Full config, Node.js runtime only (Route Handlers, Server Components,
 * Server Actions). Never import this from src/middleware.ts — use
 * ./auth.edge instead, which stays on the Edge-safe authConfig.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await userRepository.findByEmail(email);
        if (!user || user.status !== "ATIVO") return null;

        const passwordMatches = await comparePassword(password, user.passwordHash);
        if (!passwordMatches) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          atletaId: user.atletaId ?? null,
        };
      },
    }),
  ],
});
