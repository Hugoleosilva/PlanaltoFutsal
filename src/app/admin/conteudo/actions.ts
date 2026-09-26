"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { PublicarComunicadoUseCase } from "@/core/use-cases/engajamento/publicar-comunicado.use-case";
import { CriarEnqueteUseCase } from "@/core/use-cases/engajamento/criar-enquete.use-case";
import { EncerrarEnqueteUseCase } from "@/core/use-cases/engajamento/encerrar-enquete.use-case";
import { CadastrarPatrocinadorUseCase } from "@/core/use-cases/patrocinio/cadastrar-patrocinador.use-case";
import { CadastrarProdutoUseCase } from "@/core/use-cases/loja/cadastrar-produto.use-case";
import {
  MongoComunicadoRepository,
  MongoEnqueteRepository,
} from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import {
  MongoPatrocinadorRepository,
  MongoProdutoRepository,
} from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

export interface ActionState {
  error: string | null;
}

export async function publicarComunicadoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new PublicarComunicadoUseCase(new MongoComunicadoRepository());

    const titulo = formData.get("titulo");
    const corpo = formData.get("corpo");
    const tipo = formData.get("tipo");
    const fixado = formData.get("fixado");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      titulo: typeof titulo === "string" ? titulo : "",
      corpo: typeof corpo === "string" ? corpo : "",
      tipo: tipo === "NOTICIA" ? "NOTICIA" : "AVISO",
      fixado: fixado === "on",
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function criarEnqueteAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CriarEnqueteUseCase(new MongoEnqueteRepository());

    const pergunta = formData.get("pergunta");
    const opcoes = formData.get("opcoes");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      pergunta: typeof pergunta === "string" ? pergunta : "",
      opcoes:
        typeof opcoes === "string"
          ? opcoes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function encerrarEnqueteAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EncerrarEnqueteUseCase(new MongoEnqueteRepository());
    const enqueteId = formData.get("enqueteId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      enqueteId: typeof enqueteId === "string" ? enqueteId : "",
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function cadastrarPatrocinadorAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CadastrarPatrocinadorUseCase(new MongoPatrocinadorRepository());

    const nome = formData.get("nome");
    const logoUrl = formData.get("logoUrl");
    const depoimento = formData.get("depoimento");
    const link = formData.get("link");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      logoUrl: typeof logoUrl === "string" ? logoUrl : "",
      depoimento: typeof depoimento === "string" && depoimento ? depoimento : undefined,
      link: typeof link === "string" && link ? link : undefined,
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function cadastrarProdutoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CadastrarProdutoUseCase(new MongoProdutoRepository());

    const nome = formData.get("nome");
    const descricao = formData.get("descricao");
    const preco = formData.get("preco");
    const imagemUrl = formData.get("imagemUrl");
    const linkWhatsapp = formData.get("linkWhatsapp");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      descricao: typeof descricao === "string" && descricao ? descricao : undefined,
      preco: typeof preco === "string" && preco ? Number(preco) : null,
      imagemUrl: typeof imagemUrl === "string" ? imagemUrl : "",
      linkWhatsapp: typeof linkWhatsapp === "string" ? linkWhatsapp : "",
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
