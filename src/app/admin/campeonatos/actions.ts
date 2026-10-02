"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { CriarCampeonatoUseCase } from "@/core/use-cases/campeonato/criar-campeonato.use-case";
import { VincularAtletaCampeonatoUseCase } from "@/core/use-cases/campeonato/vincular-atleta-campeonato.use-case";
import { MongoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { MongoInscricaoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

function splitList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function criarCampeonatoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CriarCampeonatoUseCase(
      new MongoCampeonatoRepository(),
      new MongoAuditLogRepository(),
    );

    const nome = formData.get("nome");
    const dataInicio = formData.get("dataInicio");
    const taxaInscricao = formData.get("taxaInscricao");
    const taxaArbitragem = formData.get("taxaArbitragem");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      dataInicio: typeof dataInicio === "string" && dataInicio ? new Date(dataInicio) : null,
      diasDeJogo: splitList(formData.get("diasDeJogo")),
      horarios: splitList(formData.get("horarios")),
      taxaInscricao: typeof taxaInscricao === "string" && taxaInscricao ? Number(taxaInscricao) : null,
      taxaArbitragem:
        typeof taxaArbitragem === "string" && taxaArbitragem ? Number(taxaArbitragem) : null,
    });

    revalidatePath("/admin/campeonatos");
    revalidatePath("/admin");
    revalidatePath("/elenco");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function vincularAtletaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new VincularAtletaCampeonatoUseCase(
      new MongoCampeonatoRepository(),
      new MongoAtletaRepository(),
      new MongoInscricaoCampeonatoRepository(),
    );

    const campeonatoId = formData.get("campeonatoId");
    const atletaId = formData.get("atletaId");
    const categoria = formData.get("categoria");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      campeonatoId: typeof campeonatoId === "string" ? campeonatoId : "",
      atletaId: typeof atletaId === "string" ? atletaId : "",
      categoria: typeof categoria === "string" && categoria ? categoria : undefined,
    });

    revalidatePath("/admin/campeonatos");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
