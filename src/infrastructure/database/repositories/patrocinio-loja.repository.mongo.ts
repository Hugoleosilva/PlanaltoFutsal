import { Patrocinador, PatrocinadorState } from "@/core/domain/patrocinio/patrocinador.entity";
import { Produto, ProdutoState } from "@/core/domain/loja/produto.entity";
import {
  PatrocinadorRepository,
  ProdutoRepository,
} from "@/core/domain/patrocinio/patrocinio-loja.repository";
import { connectToDatabase } from "../mongoose";
import {
  PatrocinadorDocument,
  PatrocinadorModel,
  ProdutoDocument,
  ProdutoModel,
} from "../schemas/patrocinio-loja.schema";

function toPatrocinadorEntity(doc: PatrocinadorDocument): Patrocinador {
  const state: PatrocinadorState = {
    id: doc.id as string,
    nome: doc.nome,
    logoUrl: doc.logoUrl,
    depoimento: doc.depoimento,
    link: doc.link,
    ativo: doc.ativo,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Patrocinador.create(state);
}

export class MongoPatrocinadorRepository implements PatrocinadorRepository {
  async findAllAtivos(): Promise<Patrocinador[]> {
    await connectToDatabase();
    const docs = await PatrocinadorModel.find({ ativo: true }).sort({ nome: 1 });
    return docs.map(toPatrocinadorEntity);
  }

  async create(patrocinador: Patrocinador): Promise<Patrocinador> {
    await connectToDatabase();
    const created = await PatrocinadorModel.create({
      nome: patrocinador.nome,
      logoUrl: patrocinador.logoUrl,
      depoimento: patrocinador.depoimento,
      link: patrocinador.link,
      ativo: patrocinador.ativo,
    });
    return toPatrocinadorEntity(created);
  }
}

function toProdutoEntity(doc: ProdutoDocument): Produto {
  const state: ProdutoState = {
    id: doc.id as string,
    nome: doc.nome,
    descricao: doc.descricao,
    preco: doc.preco ?? null,
    imagemUrl: doc.imagemUrl,
    linkWhatsapp: doc.linkWhatsapp,
    ativo: doc.ativo,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Produto.create(state);
}

export class MongoProdutoRepository implements ProdutoRepository {
  async findAllAtivos(): Promise<Produto[]> {
    await connectToDatabase();
    const docs = await ProdutoModel.find({ ativo: true }).sort({ nome: 1 });
    return docs.map(toProdutoEntity);
  }

  async create(produto: Produto): Promise<Produto> {
    await connectToDatabase();
    const created = await ProdutoModel.create({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco ?? null,
      imagemUrl: produto.imagemUrl,
      linkWhatsapp: produto.linkWhatsapp,
      ativo: produto.ativo,
    });
    return toProdutoEntity(created);
  }
}
