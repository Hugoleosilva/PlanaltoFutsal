"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/security/auth";
import { PublicarComunicadoUseCase } from "@/core/use-cases/engajamento/publicar-comunicado.use-case";
import { CriarEnqueteUseCase } from "@/core/use-cases/engajamento/criar-enquete.use-case";
import { EncerrarEnqueteUseCase } from "@/core/use-cases/engajamento/encerrar-enquete.use-case";
import { CadastrarPatrocinadorUseCase } from "@/core/use-cases/patrocinio/cadastrar-patrocinador.use-case";
import { EditarPatrocinadorUseCase } from "@/core/use-cases/patrocinio/editar-patrocinador.use-case";
import { DesativarPatrocinadorUseCase } from "@/core/use-cases/patrocinio/desativar-patrocinador.use-case";
import { CadastrarProdutoUseCase } from "@/core/use-cases/loja/cadastrar-produto.use-case";
import { PublicarFotoGaleriaUseCase } from "@/core/use-cases/foto/publicar-foto-galeria.use-case";
import { CriarTopicoGaleriaUseCase } from "@/core/use-cases/foto/criar-topico-galeria.use-case";
import { MarcarFotoDestaqueUseCase } from "@/core/use-cases/foto/marcar-foto-destaque.use-case";
import { AtribuirTopicoFotoUseCase } from "@/core/use-cases/foto/atribuir-topico-foto.use-case";
import { PublicarServicoUseCase } from "@/core/use-cases/servico/publicar-servico.use-case";
import { EditarServicoUseCase } from "@/core/use-cases/servico/editar-servico.use-case";
import {
  MongoComunicadoRepository,
  MongoEnqueteRepository,
} from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import {
  MongoPatrocinadorRepository,
  MongoProdutoRepository,
} from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import {
  MongoFotoRepository,
  MongoTopicoGaleriaRepository,
} from "@/infrastructure/database/repositories/foto.repository.mongo";
import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";
import type { FormaPagamento, CategoriaServico } from "@/core/domain/servico/servico.entity";

export interface ActionState {
  error: string | null;
  sucesso?: boolean;
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
    revalidatePath("/inicio");

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
    const opcoes = formData
      .getAll("opcao")
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map((item) => item.trim());

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      pergunta: typeof pergunta === "string" ? pergunta : "",
      opcoes,
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/inicio");

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
    revalidatePath("/inicio");

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
    const ordem = formData.get("ordem");
    const escala = formData.get("escala");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      logoUrl: typeof logoUrl === "string" ? logoUrl : "",
      depoimento: typeof depoimento === "string" && depoimento ? depoimento : undefined,
      link: typeof link === "string" && link ? link : undefined,
      ordem: typeof ordem === "string" && ordem ? Number(ordem) : undefined,
      escala: typeof escala === "string" && escala ? Number(escala) : undefined,
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");
    revalidatePath("/inicio");
    revalidatePath("/agenda");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function editarPatrocinadorAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EditarPatrocinadorUseCase(new MongoPatrocinadorRepository());

    const patrocinadorId = formData.get("patrocinadorId");
    const nome = formData.get("nome");
    const logoUrl = formData.get("logoUrl");
    const depoimento = formData.get("depoimento");
    const link = formData.get("link");
    const ordem = formData.get("ordem");
    const escala = formData.get("escala");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      patrocinadorId: typeof patrocinadorId === "string" ? patrocinadorId : "",
      nome: typeof nome === "string" ? nome : "",
      logoUrl: typeof logoUrl === "string" ? logoUrl : "",
      depoimento: typeof depoimento === "string" && depoimento ? depoimento : undefined,
      link: typeof link === "string" && link ? link : undefined,
      ordem: typeof ordem === "string" && ordem ? Number(ordem) : undefined,
      escala: typeof escala === "string" && escala ? Number(escala) : undefined,
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");
    revalidatePath("/inicio");
    revalidatePath("/agenda");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function desativarPatrocinadorAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new DesativarPatrocinadorUseCase(new MongoPatrocinadorRepository());

    const patrocinadorId = formData.get("patrocinadorId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      patrocinadorId: typeof patrocinadorId === "string" ? patrocinadorId : "",
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/");
    revalidatePath("/inicio");
    revalidatePath("/agenda");

    return { error: null, sucesso: true };
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
    const imagensUrls = formData.getAll("imagemUrl").filter((url): url is string => typeof url === "string" && url.length > 0);
    const linkWhatsapp = formData.get("linkWhatsapp");
    const destaque = formData.get("destaque");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      descricao: typeof descricao === "string" && descricao ? descricao : undefined,
      preco: typeof preco === "string" && preco ? Number(preco) : null,
      imagensUrls,
      linkWhatsapp: typeof linkWhatsapp === "string" && linkWhatsapp ? linkWhatsapp : undefined,
      destaque: destaque === "on",
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/loja");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function publicarFotoGaleriaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new PublicarFotoGaleriaUseCase(
      new MongoFotoRepository(),
      new MongoTopicoGaleriaRepository(),
    );

    const urls = formData
      .getAll("fotoUrl")
      .filter((url): url is string => typeof url === "string" && url.length > 0);
    const descricao = formData.get("descricao");
    const topicoId = formData.get("topicoId");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      topicoId: typeof topicoId === "string" ? topicoId : "",
      fotos: urls.map((url) => ({
        url,
        descricao: typeof descricao === "string" && descricao ? descricao : undefined,
      })),
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/galeria");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function criarTopicoGaleriaAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new CriarTopicoGaleriaUseCase(new MongoTopicoGaleriaRepository());

    const nome = formData.get("nome");
    const categoria = formData.get("categoria");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      nome: typeof nome === "string" ? nome : "",
      categoria: categoria === "ANTIGA" ? "ANTIGA" : "ATUAL",
    });

    revalidatePath("/admin/conteudo");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function marcarFotoDestaqueAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new MarcarFotoDestaqueUseCase(new MongoFotoRepository());

    const fotoId = formData.get("fotoId");
    const destaque = formData.get("destaque");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      fotoId: typeof fotoId === "string" ? fotoId : "",
      destaque: destaque === "true",
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/galeria");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function publicarServicoDiretoriaAction(
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

    revalidatePath("/admin/conteudo");
    revalidatePath("/admin/servicos");
    revalidatePath("/servicos");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function editarServicoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EditarServicoUseCase(new MongoServicoRepository());

    const servicoId = formData.get("servicoId");
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
      servicoId: typeof servicoId === "string" ? servicoId : "",
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

    revalidatePath("/admin/conteudo");
    revalidatePath("/admin/servicos");
    revalidatePath("/servicos");

    return { error: null, sucesso: true };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}

export async function atribuirTopicoFotoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new AtribuirTopicoFotoUseCase(
      new MongoFotoRepository(),
      new MongoTopicoGaleriaRepository(),
    );

    const fotoId = formData.get("fotoId");
    const topicoId = formData.get("topicoId");
    const descricao = formData.get("descricao");

    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      fotoId: typeof fotoId === "string" ? fotoId : "",
      topicoId: typeof topicoId === "string" ? topicoId : "",
      descricao: typeof descricao === "string" ? descricao : undefined,
    });

    revalidatePath("/admin/conteudo");
    revalidatePath("/galeria");

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
