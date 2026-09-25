import { Foto, FotoState, StatusFoto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { connectToDatabase } from "../mongoose";
import { FotoDocument, FotoModel } from "../schemas/foto.schema";

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
        moderadoPorUserId: foto.moderadoPorUserId ?? null,
        moderadoEm: foto.moderadoEm ?? null,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Foto ${foto.id} não encontrada para atualização.`);
    }

    return toEntity(updated);
  }
}
