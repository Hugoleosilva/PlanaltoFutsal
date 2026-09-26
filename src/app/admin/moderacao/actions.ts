"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { AprovarFotoUseCase } from "@/core/use-cases/foto/aprovar-foto.use-case";
import { RejeitarFotoUseCase } from "@/core/use-cases/foto/rejeitar-foto.use-case";
import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function aprovarFotoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new AprovarFotoUseCase(new MongoFotoRepository(), new MongoAuditLogRepository());

    const fotoId = formData.get("fotoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      fotoId: typeof fotoId === "string" ? fotoId : "",
    });

    revalidatePath("/admin/moderacao");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function rejeitarFotoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new RejeitarFotoUseCase(new MongoFotoRepository(), new MongoAuditLogRepository());

    const fotoId = formData.get("fotoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      fotoId: typeof fotoId === "string" ? fotoId : "",
    });

    revalidatePath("/admin/moderacao");
    revalidatePath("/admin");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
