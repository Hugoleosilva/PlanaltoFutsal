import { Atleta, AtletaState } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { connectToDatabase } from "../mongoose";
import { AtletaDocument, AtletaModel } from "../schemas/atleta.schema";

function toEntity(doc: AtletaDocument): Atleta {
  const state: AtletaState = {
    id: doc.id as string,
    userId: doc.userId ? doc.userId.toString() : null,
    nomeCompleto: doc.nomeCompleto,
    apelido: doc.apelido,
    dataNascimento: doc.dataNascimento,
    fotoPrincipalUrl: doc.fotoPrincipalUrl ?? null,
    galeriaFotosUrls: doc.galeriaFotosUrls,
    bio: doc.bio,
    posicao: doc.posicao ?? null,
    estiloDeJogo: doc.estiloDeJogo,
    preferencias: doc.preferencias,
    documentos: doc.documentos,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Atleta.create(state);
}

export class MongoAtletaRepository implements AtletaRepository {
  async findById(id: string): Promise<Atleta | null> {
    await connectToDatabase();
    const doc = await AtletaModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findAllAtivos(): Promise<Atleta[]> {
    await connectToDatabase();
    const docs = await AtletaModel.find({ status: "ATIVO" }).sort({ nomeCompleto: 1 });
    return docs.map(toEntity);
  }

  async create(atleta: Atleta): Promise<Atleta> {
    await connectToDatabase();
    const created = await AtletaModel.create({
      userId: atleta.userId ?? null,
      nomeCompleto: atleta.nomeCompleto,
      apelido: atleta.apelido,
      dataNascimento: atleta.dataNascimento,
      fotoPrincipalUrl: atleta.fotoPrincipalUrl ?? null,
      galeriaFotosUrls: [...atleta.galeriaFotosUrls],
      bio: atleta.bio,
      posicao: atleta.posicao ?? null,
      estiloDeJogo: atleta.estiloDeJogo,
      preferencias: atleta.preferencias,
      documentos: [...atleta.documentos],
      status: atleta.status,
    });
    return toEntity(created);
  }

  async update(atleta: Atleta): Promise<Atleta> {
    await connectToDatabase();
    const updated = await AtletaModel.findByIdAndUpdate(
      atleta.id,
      {
        nomeCompleto: atleta.nomeCompleto,
        apelido: atleta.apelido,
        dataNascimento: atleta.dataNascimento,
        fotoPrincipalUrl: atleta.fotoPrincipalUrl ?? null,
        galeriaFotosUrls: [...atleta.galeriaFotosUrls],
        bio: atleta.bio,
        posicao: atleta.posicao ?? null,
        estiloDeJogo: atleta.estiloDeJogo,
        preferencias: atleta.preferencias,
        documentos: [...atleta.documentos],
        status: atleta.status,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Atleta ${atleta.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }
}
