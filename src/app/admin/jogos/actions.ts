"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { CadastrarJogoUseCase } from "@/core/use-cases/jogo/cadastrar-jogo.use-case";
import { CancelarJogoUseCase } from "@/core/use-cases/jogo/cancelar-jogo.use-case";
import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function cadastrarJogoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CadastrarJogoUseCase(new MongoJogoRepository());

    const adversario = formData.get("adversario");
    const dataHora = formData.get("dataHora");
    const local = formData.get("local");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      adversario: typeof adversario === "string" ? adversario : "",
      dataHora: typeof dataHora === "string" && dataHora ? new Date(dataHora) : new Date(),
      local: typeof local === "string" ? local : "",
    });

    revalidatePath("/admin/jogos");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function cancelarJogoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CancelarJogoUseCase(new MongoJogoRepository());
    const jogoId = formData.get("jogoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      jogoId: typeof jogoId === "string" ? jogoId : "",
    });

    revalidatePath("/admin/jogos");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
