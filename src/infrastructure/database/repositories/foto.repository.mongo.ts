import { Foto, FotoState, StatusFoto, CategoriaFoto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import {
  TopicoGaleria,
  TopicoGaleriaState,
} from "@/core/domain/foto/topico-galeria.entity";
import { TopicoGaleriaRepository } from "@/core/domain/foto/topico-galeria.repository";
import { connectToDatabase } from "../mongoose";
import {
  FotoDocument,
  FotoModel,
  TopicoGaleriaDocument,
  TopicoGaleriaModel,
} from "../schemas/foto.schema";

function toEntity(doc: FotoDocument): Foto {
  const state: FotoState = {
    id: doc.id as string,
    url: doc.url,
    descricao: doc.descricao,
    categoria: doc.categoria,
    status: doc.status,
    enviadoPorNome: doc.enviadoPorNome,
    enviadoPorContato: doc.enviadoPorContato,
    atletaId: doc.atletaId ? doc.atletaId.toString() : null,
    loteEnvioId: doc.loteEnvioId,
    moderadoPorUserId: doc.moderadoPorUserId ? doc.moderadoPorUserId.toString() : null,
    moderadoEm: doc.moderadoEm ?? null,
    topicoId: doc.topicoId ? doc.topicoId.toString() : null,
    destaque: doc.destaque,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Foto.create(state);
}

function toDocumentProps(foto: Foto) {
  return {
    url: foto.url,
    descricao: foto.descricao,
    categoria: foto.categoria,
    status: foto.status,
    enviadoPorNome: foto.enviadoPorNome,
    enviadoPorContato: foto.enviadoPorContato,
    loteEnvioId: foto.loteEnvioId,
    atletaId: foto.atletaId ?? null,
    topicoId: foto.topicoId ?? null,
    destaque: foto.destaque,
  };
}

export class MongoFotoRepository implements FotoRepository {
  async findById(id: string): Promise<Foto | null> {
    await connectToDatabase();
    const doc = await FotoModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByStatus(status: StatusFoto): Promise<Foto[]> {
    await connectToDatabase();
    const docs = await FotoModel.find({ status }).sort({ createdAt: -1 });
    return docs.map(toEntity);
  }

  async countByLoteEnvio(loteEnvioId: string): Promise<number> {
    await connectToDatabase();
    return FotoModel.countDocuments({ loteEnvioId });
  }

  async create(foto: Foto): Promise<Foto> {
    await connectToDatabase();
    const created = await FotoModel.create(toDocumentProps(foto));
    return toEntity(created);
  }

  async createMany(fotos: Foto[]): Promise<Foto[]> {
    await connectToDatabase();
    const created = await FotoModel.insertMany(fotos.map(toDocumentProps));
    return created.map((doc) => toEntity(doc as FotoDocument));
  }

  async update(foto: Foto): Promise<Foto> {
    await connectToDatabase();
    const updated = await FotoModel.findByIdAndUpdate(
      foto.id,
      {
        status: foto.status,
        categoria: foto.categoria,
        moderadoPorUserId: foto.moderadoPorUserId ?? null,
        moderadoEm: foto.moderadoEm ?? null,
        topicoId: foto.topicoId ?? null,
        destaque: foto.destaque,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Foto ${foto.id} não encontrada para atualização.`);
    }

    return toEntity(updated);
  }
}

function toTopicoEntity(doc: TopicoGaleriaDocument): TopicoGaleria {
  const state: TopicoGaleriaState = {
    id: doc.id as string,
    nome: doc.nome,
    categoria: doc.categoria,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return TopicoGaleria.create(state);
}

export class MongoTopicoGaleriaRepository implements TopicoGaleriaRepository {
  async findById(id: string): Promise<TopicoGaleria | null> {
    await connectToDatabase();
    const doc = await TopicoGaleriaModel.findById(id);
    return doc ? toTopicoEntity(doc) : null;
  }

  async findAll(): Promise<TopicoGaleria[]> {
    await connectToDatabase();
    const docs = await TopicoGaleriaModel.find().sort({ createdAt: -1 });
    return docs.map(toTopicoEntity);
  }

  async findByCategoria(categoria: CategoriaFoto): Promise<TopicoGaleria[]> {
    await connectToDatabase();
    const docs = await TopicoGaleriaModel.find({ categoria }).sort({ createdAt: -1 });
    return docs.map(toTopicoEntity);
  }

  async create(topico: TopicoGaleria): Promise<TopicoGaleria> {
    await connectToDatabase();
    const created = await TopicoGaleriaModel.create({
      nome: topico.nome,
      categoria: topico.categoria,
    });
    return toTopicoEntity(created);
  }
}
