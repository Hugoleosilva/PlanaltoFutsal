import { NextRequest, NextResponse } from "next/server";
import { VerificarEmailUseCase } from "@/core/use-cases/user/verificar-email.use-case";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { MongoVerificacaoEmailRepository } from "@/infrastructure/database/repositories/verificacao-email.repository.mongo";
import { getEmailSender } from "@/infrastructure/notifications/get-email-sender";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");
  const origin = request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(new URL("/login?verificacao=invalida", origin));
  }

  try {
    const useCase = new VerificarEmailUseCase(
      new MongoUserRepository(),
      new MongoAtletaRepository(),
      new MongoVerificacaoEmailRepository(),
      getEmailSender(),
    );

    await useCase.execute({ token, linkLoginBase: `${origin}/login` });

    return NextResponse.redirect(new URL("/login?verificacao=ok", origin));
  } catch {
    return NextResponse.redirect(new URL("/login?verificacao=invalida", origin));
  }
}
