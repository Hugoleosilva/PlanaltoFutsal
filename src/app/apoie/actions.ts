"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { TornarSocioUseCase } from "@/core/use-cases/user/tornar-socio.use-case";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoContribuicaoSocioRepository } from "@/infrastructure/database/repositories/contribuicao-socio.repository.mongo";
import { UnauthorizedError, ValidationException, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
  sucesso?: boolean;
  contribuicaoValor?: number;
}

export async function tornarSocioAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const tipo = formData.get("tipo");
    const valor = formData.get("valor");
    const diaVencimento = formData.get("diaVencimento");

    if (tipo !== "MENSAL" && tipo !== "UNICO") {
      throw new ValidationException([]);
    }

    const useCase = new TornarSocioUseCase(
      new MongoUserRepository(),
      new MongoContribuicaoSocioRepository(),
    );

    const { contribuicao } = await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      tipo,
      valor: Number(valor),
      diaVencimento: diaVencimento ? Number(diaVencimento) : null,
    });

    revalidatePath("/apoie");
    revalidatePath("/admin");
    revalidatePath("/admin/socios");

    return { error: null, sucesso: true, contribuicaoValor: contribuicao.valor };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
