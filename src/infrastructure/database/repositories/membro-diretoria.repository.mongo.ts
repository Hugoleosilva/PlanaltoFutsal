import {
  MembroDiretoria,
  MembroDiretoriaState,
} from "@/core/domain/diretoria/membro-diretoria.entity";
import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";
import { connectToDatabase } from "../mongoose";
import { MembroDiretoriaDocument, MembroDiretoriaModel } from "../schemas/membro-diretoria.schema";

function toEntity(doc: MembroDiretoriaDocument): MembroDiretoria {
  const state: MembroDiretoriaState = {
    id: doc.id as string,
    nome: doc.nome,
    funcao: doc.funcao,
    fotoUrl: doc.fotoUrl ?? null,
    bio: doc.bio,
    ordem: doc.ordem,
    contato: doc.contato,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return MembroDiretoria.create(state);
}

export class MongoMembroDiretoriaRepository implements MembroDiretoriaRepository {
  async findById(id: string): Promise<MembroDiretoria | null> {
    await connectToDatabase();
    const doc = await MembroDiretoriaModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findAllAtivos(): Promise<MembroDiretoria[]> {
    await connectToDatabase();
    const docs = await MembroDiretoriaModel.find({ status: "ATIVO" }).sort({ ordem: 1, createdAt: 1 });
    return docs.map(toEntity);
  }

  async create(membro: MembroDiretoria): Promise<MembroDiretoria> {
    await connectToDatabase();
    const created = await MembroDiretoriaModel.create({
      nome: membro.nome,
      funcao: membro.funcao,
      fotoUrl: membro.fotoUrl ?? null,
      bio: membro.bio,
      ordem: membro.ordem,
      contato: membro.contato,
      status: membro.status,
    });
    return toEntity(created);
  }

  async update(membro: MembroDiretoria): Promise<MembroDiretoria> {
    await connectToDatabase();
    const updated = await MembroDiretoriaModel.findByIdAndUpdate(
      membro.id,
      {
        nome: membro.nome,
        funcao: membro.funcao,
        fotoUrl: membro.fotoUrl ?? null,
        bio: membro.bio,
        ordem: membro.ordem,
        contato: membro.contato,
        status: membro.status,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Membro da diretoria ${membro.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }
}
