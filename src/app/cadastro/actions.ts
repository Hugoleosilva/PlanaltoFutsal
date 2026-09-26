"use server";

import { headers } from "next/headers";
import { RegistrarUsuarioUseCase } from "@/core/use-cases/user/registrar-usuario.use-case";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoVerificacaoEmailRepository } from "@/infrastructure/database/repositories/verificacao-email.repository.mongo";
import { hashPassword } from "@/infrastructure/security/password-hasher";
import { getEmailSender } from "@/infrastructure/notifications/get-email-sender";
import { toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
  sucesso: boolean;
}

export async function registrarUsuarioAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const nomeCompleto = formData.get("nomeCompleto");
    const email = formData.get("email");
    const whatsapp = formData.get("whatsapp");
    const senha = formData.get("senha");

    const useCase = new RegistrarUsuarioUseCase(
      new MongoUserRepository(),
      new MongoVerificacaoEmailRepository(),
      hashPassword,
      getEmailSender(),
    );

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3001";
    const protocol = host.startsWith("localhost") ? "http" : "https";

    await useCase.execute({
      nomeCompleto: typeof nomeCompleto === "string" ? nomeCompleto : "",
      email: typeof email === "string" ? email : "",
      whatsapp: typeof whatsapp === "string" && whatsapp ? whatsapp : undefined,
      senha: typeof senha === "string" ? senha : "",
      linkVerificacaoBase: `${protocol}://${host}/api/auth/verificar`,
    });

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}
