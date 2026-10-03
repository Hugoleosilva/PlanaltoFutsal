"use server";

import { headers } from "next/headers";
import { RedefinirSenhaUseCase } from "@/core/use-cases/user/redefinir-senha.use-case";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoRedefinicaoSenhaRepository } from "@/infrastructure/database/repositories/redefinicao-senha.repository.mongo";
import { hashPassword } from "@/infrastructure/security/password-hasher";
import { getEmailSender } from "@/infrastructure/notifications/get-email-sender";
import { toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
  sucesso: boolean;
}

export async function redefinirSenhaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const token = formData.get("token");
    const novaSenha = formData.get("novaSenha");
    const confirmarSenha = formData.get("confirmarSenha");

    if (novaSenha !== confirmarSenha) {
      return { error: "As senhas não coincidem.", sucesso: false };
    }

    const useCase = new RedefinirSenhaUseCase(
      new MongoUserRepository(),
      new MongoRedefinicaoSenhaRepository(),
      hashPassword,
      getEmailSender(),
    );

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3001";
    const protocol = host.startsWith("localhost") ? "http" : "https";

    await useCase.execute({
      token: typeof token === "string" ? token : "",
      novaSenha: typeof novaSenha === "string" ? novaSenha : "",
      linkLoginBase: `${protocol}://${host}/login`,
    });

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}
