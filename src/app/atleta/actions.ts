"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { AtualizarPerfilAtletaUseCase } from "@/core/use-cases/atleta/atualizar-perfil-atleta.use-case";
import {
  AdicionarFotoGaleriaUseCase,
  RemoverFotoGaleriaUseCase,
} from "@/core/use-cases/atleta/gerenciar-galeria-atleta.use-case";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
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

export async function atualizarPerfilAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new AtualizarPerfilAtletaUseCase(new MongoAtletaRepository());

    const apelido = formData.get("apelido");
    const bio = formData.get("bio");
    const estiloDeJogo = formData.get("estiloDeJogo");
    const preferencias = formData.get("preferencias");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      apelido: typeof apelido === "string" && apelido ? apelido : undefined,
      bio: typeof bio === "string" ? bio : undefined,
      posicao: readPosicao(formData),
      estiloDeJogo: typeof estiloDeJogo === "string" ? estiloDeJogo : undefined,
      preferencias: typeof preferencias === "string" ? preferencias : undefined,
    });

    revalidatePath("/atleta");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function atualizarFotoPrincipalAction(url: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new AtualizarPerfilAtletaUseCase(new MongoAtletaRepository());
    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      fotoPrincipalUrl: url,
    });

    revalidatePath("/atleta");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function adicionarFotoGaleriaAction(url: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new AdicionarFotoGaleriaUseCase(new MongoAtletaRepository());
    await useCase.execute({ actor: { id: session.user.id, role: session.user.role }, url });

    revalidatePath("/atleta");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function removerFotoGaleriaAction(url: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new RemoverFotoGaleriaUseCase(new MongoAtletaRepository());
    await useCase.execute({ actor: { id: session.user.id, role: session.user.role }, url });

    revalidatePath("/atleta");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
