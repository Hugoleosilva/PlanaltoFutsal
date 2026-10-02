"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { CadastrarJogoUseCase } from "@/core/use-cases/jogo/cadastrar-jogo.use-case";
import { EditarJogoUseCase } from "@/core/use-cases/jogo/editar-jogo.use-case";
import { CancelarJogoUseCase } from "@/core/use-cases/jogo/cancelar-jogo.use-case";
import { ExcluirJogoUseCase } from "@/core/use-cases/jogo/excluir-jogo.use-case";
import { RegistrarResultadoJogoUseCase } from "@/core/use-cases/jogo/registrar-resultado-jogo.use-case";
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
    const adversarioEscudoUrl = formData.get("adversarioEscudoUrl");
    const dataHora = formData.get("dataHora");
    const local = formData.get("local");
    const campeonatoId = formData.get("campeonatoId");
    const mandante = formData.get("mandante");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      adversario: typeof adversario === "string" ? adversario : "",
      adversarioEscudoUrl:
        typeof adversarioEscudoUrl === "string" && adversarioEscudoUrl ? adversarioEscudoUrl : null,
      dataHora: typeof dataHora === "string" && dataHora ? new Date(dataHora) : null,
      local: typeof local === "string" ? local : "",
      campeonatoId: typeof campeonatoId === "string" && campeonatoId ? campeonatoId : null,
      mandante: mandante === "ADVERSARIO" ? "ADVERSARIO" : "PLANALTO",
    });

    revalidatePath("/admin/jogos");
    revalidatePath("/agenda");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function editarJogoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EditarJogoUseCase(new MongoJogoRepository());

    const jogoId = formData.get("jogoId");
    const adversario = formData.get("adversario");
    const adversarioEscudoUrl = formData.get("adversarioEscudoUrl");
    const dataHora = formData.get("dataHora");
    const local = formData.get("local");
    const campeonatoId = formData.get("campeonatoId");
    const mandante = formData.get("mandante");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      jogoId: typeof jogoId === "string" ? jogoId : "",
      adversario: typeof adversario === "string" ? adversario : "",
      adversarioEscudoUrl:
        typeof adversarioEscudoUrl === "string" && adversarioEscudoUrl ? adversarioEscudoUrl : null,
      dataHora: typeof dataHora === "string" && dataHora ? new Date(dataHora) : null,
      local: typeof local === "string" ? local : "",
      campeonatoId: typeof campeonatoId === "string" && campeonatoId ? campeonatoId : null,
      mandante: mandante === "ADVERSARIO" ? "ADVERSARIO" : "PLANALTO",
    });

    revalidatePath("/admin/jogos");
    revalidatePath("/agenda");

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
    revalidatePath("/agenda");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function excluirJogoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new ExcluirJogoUseCase(new MongoJogoRepository());
    const jogoId = formData.get("jogoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      jogoId: typeof jogoId === "string" ? jogoId : "",
    });

    revalidatePath("/admin/jogos");
    revalidatePath("/agenda");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function registrarResultadoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new RegistrarResultadoJogoUseCase(new MongoJogoRepository());

    const jogoId = formData.get("jogoId");
    const placarPlanalto = formData.get("placarPlanalto");
    const placarAdversario = formData.get("placarAdversario");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      jogoId: typeof jogoId === "string" ? jogoId : "",
      placarPlanalto: Number(placarPlanalto) || 0,
      placarAdversario: Number(placarAdversario) || 0,
    });

    revalidatePath("/admin/jogos");
    revalidatePath("/agenda");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
