"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { AprovarServicoUseCase } from "@/core/use-cases/servico/aprovar-servico.use-case";
import { RejeitarServicoUseCase } from "@/core/use-cases/servico/rejeitar-servico.use-case";
import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function aprovarServicoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new AprovarServicoUseCase(
      new MongoServicoRepository(),
      new MongoAuditLogRepository(),
    );

    const servicoId = formData.get("servicoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      servicoId: typeof servicoId === "string" ? servicoId : "",
    });

    revalidatePath("/admin/servicos");
    revalidatePath("/servicos");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function rejeitarServicoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new RejeitarServicoUseCase(
      new MongoServicoRepository(),
      new MongoAuditLogRepository(),
    );

    const servicoId = formData.get("servicoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      servicoId: typeof servicoId === "string" ? servicoId : "",
    });

    revalidatePath("/admin/servicos");
    revalidatePath("/servicos");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
