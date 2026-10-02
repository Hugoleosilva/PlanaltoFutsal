"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { MarcarContribuicaoRecebidaUseCase } from "@/core/use-cases/socio/marcar-contribuicao-recebida.use-case";
import { MongoContribuicaoSocioRepository } from "@/infrastructure/database/repositories/contribuicao-socio.repository.mongo";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoMovimentacaoFinanceiraRepository } from "@/infrastructure/database/repositories/movimentacao-financeira.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function marcarContribuicaoRecebidaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const contribuicaoId = formData.get("contribuicaoId");

    const useCase = new MarcarContribuicaoRecebidaUseCase(
      new MongoContribuicaoSocioRepository(),
      new MongoUserRepository(),
      new MongoMovimentacaoFinanceiraRepository(),
    );

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      contribuicaoId: typeof contribuicaoId === "string" ? contribuicaoId : "",
    });

    revalidatePath("/admin/socios");
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
