import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge Runtime instance, used only by src/middleware.ts. Only decodes/reads
 * the JWT session (no providers, no database access) so it stays free of
 * Mongoose/node:crypto and can run in the Edge Runtime.
 */
export const { auth } = NextAuth(authConfig);
