import { Comunicado, ComunicadoState } from "@/core/domain/engajamento/comunicado.entity";
import { Enquete, EnqueteState } from "@/core/domain/engajamento/enquete.entity";
import {
  ComunicadoRepository,
  EnqueteRepository,
} from "@/core/domain/engajamento/engajamento.repository";
import { connectToDatabase } from "../mongoose";
import {
  ComunicadoDocument,
  ComunicadoModel,
  EnqueteDocument,
  EnqueteModel,
} from "../schemas/engajamento.schema";

function toEnqueteEntity(doc: EnqueteDocument): Enquete {
  const state: EnqueteState = {
    id: doc.id as string,
    pergunta: doc.pergunta,
    opcoes: doc.opcoes,
    status: doc.status,
    criadoPorUserId: doc.criadoPorUserId.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Enquete.create(state);
}

export class MongoEnqueteRepository implements EnqueteRepository {
  async findById(id: string): Promise<Enquete | null> {
    await connectToDatabase();
    const doc = await EnqueteModel.findById(id);
    return doc ? toEnqueteEntity(doc) : null;
  }

  async findAtiva(): Promise<Enquete | null> {
    await connectToDatabase();
    const doc = await EnqueteModel.findOne({ status: "ATIVA" }).sort({ createdAt: -1 });
    return doc ? toEnqueteEntity(doc) : null;
  }

  async create(enquete: Enquete): Promise<Enquete> {
    await connectToDatabase();
    const created = await EnqueteModel.create({
      pergunta: enquete.pergunta,
      opcoes: [...enquete.opcoes],
      status: enquete.status,
      criadoPorUserId: enquete.criadoPorUserId,
    });
    return toEnqueteEntity(created);
  }

  async update(enquete: Enquete): Promise<Enquete> {
    await connectToDatabase();
    const updated = await EnqueteModel.findByIdAndUpdate(
      enquete.id,
      { opcoes: [...enquete.opcoes], status: enquete.status },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Enquete ${enquete.id} não encontrada para atualização.`);
    }

    return toEnqueteEntity(updated);
  }
}

function toComunicadoEntity(doc: ComunicadoDocument): Comunicado {
  const state: ComunicadoState = {
    id: doc.id as string,
    titulo: doc.titulo,
    corpo: doc.corpo,
    tipo: doc.tipo,
    fixado: doc.fixado,
    autorUserId: doc.autorUserId.toString(),
    publicadoEm: doc.publicadoEm,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Comunicado.create(state);
}

export class MongoComunicadoRepository implements ComunicadoRepository {
  async findRecentes(limite: number): Promise<Comunicado[]> {
    await connectToDatabase();
    const docs = await ComunicadoModel.find().sort({ fixado: -1, publicadoEm: -1 }).limit(limite);
    return docs.map(toComunicadoEntity);
  }

  async create(comunicado: Comunicado): Promise<Comunicado> {
    await connectToDatabase();
    const created = await ComunicadoModel.create({
      titulo: comunicado.titulo,
      corpo: comunicado.corpo,
      tipo: comunicado.tipo,
      fixado: comunicado.fixado,
      autorUserId: comunicado.autorUserId,
      publicadoEm: comunicado.publicadoEm,
    });
    return toComunicadoEntity(created);
  }
}
