"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { RegistrarMovimentacaoFinanceiraUseCase } from "@/core/use-cases/financeiro/registrar-movimentacao-financeira.use-case";
import { ExcluirMovimentacaoFinanceiraUseCase } from "@/core/use-cases/financeiro/excluir-movimentacao-financeira.use-case";
import { MongoMovimentacaoFinanceiraRepository } from "@/infrastructure/database/repositories/movimentacao-financeira.repository.mongo";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function registrarMovimentacaoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new RegistrarMovimentacaoFinanceiraUseCase(
      new MongoMovimentacaoFinanceiraRepository(),
      new MongoAuditLogRepository(),
    );

    const tipo = formData.get("tipo");
    const descricao = formData.get("descricao");
    const valor = formData.get("valor");
    const data = formData.get("data");
    const categoria = formData.get("categoria");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      tipo: tipo === "DESPESA" ? "DESPESA" : "RECEITA",
      descricao: typeof descricao === "string" ? descricao : "",
      valor: Number(valor),
      data: typeof data === "string" && data ? new Date(data) : new Date(),
      categoria: typeof categoria === "string" && categoria ? categoria : undefined,
    });

    revalidatePath("/admin/financeiro");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function excluirMovimentacaoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new ExcluirMovimentacaoFinanceiraUseCase(
      new MongoMovimentacaoFinanceiraRepository(),
      new MongoAuditLogRepository(),
    );

    const movimentacaoId = formData.get("movimentacaoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      movimentacaoId: typeof movimentacaoId === "string" ? movimentacaoId : "",
    });

    revalidatePath("/admin/financeiro");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
