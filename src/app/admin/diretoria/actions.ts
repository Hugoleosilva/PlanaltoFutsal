"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { CadastrarMembroDiretoriaUseCase } from "@/core/use-cases/diretoria/cadastrar-membro-diretoria.use-case";
import { EditarMembroDiretoriaUseCase } from "@/core/use-cases/diretoria/editar-membro-diretoria.use-case";
import { DesativarMembroDiretoriaUseCase } from "@/core/use-cases/diretoria/desativar-membro-diretoria.use-case";
import { MongoMembroDiretoriaRepository } from "@/infrastructure/database/repositories/membro-diretoria.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function cadastrarMembroDiretoriaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CadastrarMembroDiretoriaUseCase(new MongoMembroDiretoriaRepository());

    const nome = formData.get("nome");
    const funcao = formData.get("funcao");
    const fotoUrl = formData.get("fotoUrl");
    const bio = formData.get("bio");
    const ordem = formData.get("ordem");
    const contato = formData.get("contato");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      funcao: typeof funcao === "string" ? funcao : "",
      fotoUrl: typeof fotoUrl === "string" && fotoUrl ? fotoUrl : null,
      bio: typeof bio === "string" && bio ? bio : undefined,
      ordem: typeof ordem === "string" && ordem ? Number(ordem) : undefined,
      contato: typeof contato === "string" && contato ? contato : undefined,
    });

    revalidatePath("/admin/diretoria");
    revalidatePath("/diretoria");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function editarMembroDiretoriaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EditarMembroDiretoriaUseCase(new MongoMembroDiretoriaRepository());

    const membroId = formData.get("membroId");
    const nome = formData.get("nome");
    const funcao = formData.get("funcao");
    const bio = formData.get("bio");
    const ordem = formData.get("ordem");
    const contato = formData.get("contato");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      membroId: typeof membroId === "string" ? membroId : "",
      nome: typeof nome === "string" ? nome : undefined,
      funcao: typeof funcao === "string" ? funcao : undefined,
      bio: typeof bio === "string" ? bio : undefined,
      ordem: typeof ordem === "string" && ordem ? Number(ordem) : undefined,
      contato: typeof contato === "string" ? contato : undefined,
    });

    revalidatePath("/admin/diretoria");
    revalidatePath("/diretoria");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function atualizarFotoMembroDiretoriaAction(
  membroId: string,
  fotoUrl: string,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EditarMembroDiretoriaUseCase(new MongoMembroDiretoriaRepository());

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      membroId,
      fotoUrl,
    });

    revalidatePath("/admin/diretoria");
    revalidatePath("/diretoria");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function desativarMembroDiretoriaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new DesativarMembroDiretoriaUseCase(new MongoMembroDiretoriaRepository());

    const membroId = formData.get("membroId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      membroId: typeof membroId === "string" ? membroId : "",
    });

    revalidatePath("/admin/diretoria");
    revalidatePath("/diretoria");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
