"use server";

import { headers } from "next/headers";
import { SolicitarRedefinicaoSenhaUseCase } from "@/core/use-cases/user/solicitar-redefinicao-senha.use-case";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoRedefinicaoSenhaRepository } from "@/infrastructure/database/repositories/redefinicao-senha.repository.mongo";
import { getEmailSender } from "@/infrastructure/notifications/get-email-sender";
import { toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
  sucesso: boolean;
}

export async function solicitarRedefinicaoSenhaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const email = formData.get("email");

    const useCase = new SolicitarRedefinicaoSenhaUseCase(
      new MongoUserRepository(),
      new MongoRedefinicaoSenhaRepository(),
      getEmailSender(),
    );

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3001";
    const protocol = host.startsWith("localhost") ? "http" : "https";

    await useCase.execute({
      email: typeof email === "string" ? email : "",
      linkRedefinicaoBase: `${protocol}://${host}/redefinir-senha`,
    });

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}
