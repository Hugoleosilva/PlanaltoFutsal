"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { CadastrarAtletaUseCase } from "@/core/use-cases/atleta/cadastrar-atleta.use-case";
import { DesativarAtletaUseCase } from "@/core/use-cases/atleta/desativar-atleta.use-case";
import { EditarAtletaUseCase } from "@/core/use-cases/atleta/editar-atleta.use-case";
import { CriarAcessoAtletaUseCase } from "@/core/use-cases/atleta/criar-acesso-atleta.use-case";
import { PromoverUsuarioParaAtletaUseCase } from "@/core/use-cases/atleta/promover-usuario-atleta.use-case";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { hashPassword } from "@/infrastructure/security/password-hasher";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";
import type { AtletaPosicao } from "@/core/domain/atleta/atleta.entity";

export interface ActionState {
  error: string | null;
}

function readPosicao(formData: FormData): AtletaPosicao | null {
  const posicao = formData.get("posicao");
  if (posicao === "" || posicao === null) return null;
  return posicao as AtletaPosicao;
}

export async function cadastrarAtletaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CadastrarAtletaUseCase(
      new MongoAtletaRepository(),
      new MongoAuditLogRepository(),
    );

    const nomeCompleto = formData.get("nomeCompleto");
    const apelido = formData.get("apelido");
    const dataNascimento = formData.get("dataNascimento");
    const bio = formData.get("bio");
    const estiloDeJogo = formData.get("estiloDeJogo");
    const contatoEmail = formData.get("contatoEmail");
    const contatoWhatsapp = formData.get("contatoWhatsapp");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nomeCompleto: typeof nomeCompleto === "string" ? nomeCompleto : "",
      apelido: typeof apelido === "string" ? apelido : "",
      dataNascimento:
        typeof dataNascimento === "string" && dataNascimento
          ? new Date(dataNascimento)
          : new Date(),
      posicao: readPosicao(formData),
      bio: typeof bio === "string" && bio ? bio : undefined,
      estiloDeJogo: typeof estiloDeJogo === "string" && estiloDeJogo ? estiloDeJogo : undefined,
      contatoEmail: typeof contatoEmail === "string" && contatoEmail ? contatoEmail : undefined,
      contatoWhatsapp:
        typeof contatoWhatsapp === "string" && contatoWhatsapp ? contatoWhatsapp : undefined,
    });

    revalidatePath("/admin/elenco");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function atualizarFotoAtletaAction(atletaId: string, fotoPrincipalUrl: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EditarAtletaUseCase(
      new MongoAtletaRepository(),
      new MongoAuditLogRepository(),
    );

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      atletaId,
      fotoPrincipalUrl,
    });

    revalidatePath("/admin/elenco");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function criarAcessoAtletaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CriarAcessoAtletaUseCase(
      new MongoAtletaRepository(),
      new MongoUserRepository(),
      hashPassword,
    );

    const atletaId = formData.get("atletaId");
    const email = formData.get("email");
    const senha = formData.get("senha");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      atletaId: typeof atletaId === "string" ? atletaId : "",
      email: typeof email === "string" ? email : "",
      senha: typeof senha === "string" ? senha : "",
    });

    revalidatePath("/admin/elenco");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function promoverUsuarioAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new PromoverUsuarioParaAtletaUseCase(
      new MongoUserRepository(),
      new MongoAtletaRepository(),
    );

    const userEmail = formData.get("userEmail");
    const atletaId = formData.get("atletaId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      userEmail: typeof userEmail === "string" ? userEmail : "",
      atletaId: typeof atletaId === "string" ? atletaId : "",
    });

    revalidatePath("/admin/elenco");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function desativarAtletaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new DesativarAtletaUseCase(
      new MongoAtletaRepository(),
      new MongoAuditLogRepository(),
    );

    const atletaId = formData.get("atletaId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      atletaId: typeof atletaId === "string" ? atletaId : "",
    });

    revalidatePath("/admin/elenco");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
