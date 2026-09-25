import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/security/auth.edge";
import type { Role } from "@/shared/types/role";

const ROUTE_ROLE_REQUIREMENTS: Array<{ prefix: string; roles: readonly Role[] }> = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/atleta", roles: ["ADMIN", "ATLETA"] },
];

export default auth((request) => {
  const { nextUrl } = request;
  const matchedRule = ROUTE_ROLE_REQUIREMENTS.find((rule) =>
    nextUrl.pathname.startsWith(rule.prefix),
  );

  if (!matchedRule) return NextResponse.next();

  const session = request.auth;

  if (!session?.user) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!matchedRule.roles.includes(session.user.role)) {
    return NextResponse.redirect(new URL("/acesso-negado", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/atleta/:path*"],
};
