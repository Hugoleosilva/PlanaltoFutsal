"use server";

import { revalidatePath } from "next/cache";
import { EnviarFotosTorcedorUseCase } from "@/core/use-cases/foto/enviar-fotos-torcedor.use-case";
import { OferecerCaronaUseCase } from "@/core/use-cases/carona/oferecer-carona.use-case";
import { VotarEnqueteUseCase } from "@/core/use-cases/engajamento/votar-enquete.use-case";
import { PublicarServicoUseCase } from "@/core/use-cases/servico/publicar-servico.use-case";
import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";
import { MongoCaronaSolidariaRepository } from "@/infrastructure/database/repositories/carona-solidaria.repository.mongo";
import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { MongoEnqueteRepository } from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { auth } from "@/infrastructure/security/auth";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";
import type { FormaPagamento, CategoriaServico } from "@/core/domain/servico/servico.entity";

export interface ActionState {
  error: string | null;
  sucesso: boolean;
}

export async function enviarFotosTorcedorAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const urls = formData.getAll("fotoUrl").filter((url): url is string => typeof url === "string" && url.length > 0);
    const descricao = formData.get("descricao");
    const categoria = formData.get("categoria");
    const enviadoPorNome = formData.get("enviadoPorNome");
    const enviadoPorContato = formData.get("enviadoPorContato");

    const useCase = new EnviarFotosTorcedorUseCase(new MongoFotoRepository());

    await useCase.execute({
      fotos: urls.map((url) => ({
        url,
        descricao: typeof descricao === "string" && descricao ? descricao : undefined,
        categoria: categoria === "ANTIGA" ? "ANTIGA" : "ATUAL",
      })),
      enviadoPorNome: typeof enviadoPorNome === "string" && enviadoPorNome ? enviadoPorNome : undefined,
      enviadoPorContato:
        typeof enviadoPorContato === "string" && enviadoPorContato ? enviadoPorContato : undefined,
    });

    revalidatePath("/admin/moderacao");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}

export async function oferecerCaronaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const jogoId = formData.get("jogoId");
    const motoristaNome = formData.get("motoristaNome");
    const contato = formData.get("contato");
    const horarioSaida = formData.get("horarioSaida");
    const local = formData.get("local");
    const vagasDisponiveis = formData.get("vagasDisponiveis");

    const useCase = new OferecerCaronaUseCase(
      new MongoCaronaSolidariaRepository(),
      new MongoJogoRepository(),
    );

    await useCase.execute({
      jogoId: typeof jogoId === "string" ? jogoId : "",
      motoristaNome: typeof motoristaNome === "string" ? motoristaNome : "",
      contato: typeof contato === "string" ? contato : "",
      horarioSaida: typeof horarioSaida === "string" && horarioSaida ? new Date(horarioSaida) : new Date(),
      local: typeof local === "string" ? local : "",
      vagasDisponiveis: Number(vagasDisponiveis) || 1,
    });

    revalidatePath("/carona");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}

export async function votarEnqueteAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const enqueteId = formData.get("enqueteId");
    const opcaoId = formData.get("opcaoId");

    const useCase = new VotarEnqueteUseCase(new MongoEnqueteRepository());

    await useCase.execute({
      enqueteId: typeof enqueteId === "string" ? enqueteId : "",
      opcaoId: typeof opcaoId === "string" ? opcaoId : "",
    });

    revalidatePath("/inicio");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}

export async function publicarServicoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new PublicarServicoUseCase(new MongoServicoRepository());

    const titulo = formData.get("titulo");
    const descricao = formData.get("descricao");
    const imagensUrls = formData
      .getAll("imagemUrl")
      .filter((url): url is string => typeof url === "string" && url.length > 0);
    const valores = formData.get("valores");
    const formasPagamento = formData.getAll("formasPagamento") as FormaPagamento[];
    const categoria = formData.get("categoria");
    const bairro = formData.get("bairro");
    const nomeContato = formData.get("nomeContato");
    const contato = formData.get("contato");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      titulo: typeof titulo === "string" ? titulo : "",
      descricao: typeof descricao === "string" ? descricao : "",
      imagensUrls,
      valores: typeof valores === "string" && valores ? valores : undefined,
      formasPagamento,
      categoria: categoria as CategoriaServico,
      bairro: typeof bairro === "string" ? bairro : "",
      nomeContato: typeof nomeContato === "string" ? nomeContato : "",
      contato: typeof contato === "string" ? contato : "",
    });

    revalidatePath("/admin/servicos");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message, sucesso: false };
  }
}
