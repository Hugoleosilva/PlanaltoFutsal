import { Campeonato, CampeonatoState } from "@/core/domain/campeonato/campeonato.entity";
import {
  InscricaoCampeonato,
  InscricaoCampeonatoState,
} from "@/core/domain/campeonato/inscricao-campeonato.entity";
import {
  CampeonatoRepository,
  InscricaoCampeonatoRepository,
} from "@/core/domain/campeonato/campeonato.repository";
import { connectToDatabase } from "../mongoose";
import {
  CampeonatoDocument,
  CampeonatoModel,
  InscricaoCampeonatoDocument,
  InscricaoCampeonatoModel,
} from "../schemas/campeonato.schema";

function toEntity(doc: CampeonatoDocument): Campeonato {
  const state: CampeonatoState = {
    id: doc.id as string,
    nome: doc.nome,
    dataInicio: doc.dataInicio ?? null,
    diasDeJogo: doc.diasDeJogo,
    horarios: doc.horarios,
    taxaInscricao: doc.taxaInscricao ?? null,
    taxaArbitragem: doc.taxaArbitragem ?? null,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Campeonato.create(state);
}

export class MongoCampeonatoRepository implements CampeonatoRepository {
  async findById(id: string): Promise<Campeonato | null> {
    await connectToDatabase();
    const doc = await CampeonatoModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findAll(): Promise<Campeonato[]> {
    await connectToDatabase();
    const docs = await CampeonatoModel.find().sort({ dataInicio: -1, createdAt: -1 });
    return docs.map(toEntity);
  }

  async create(campeonato: Campeonato): Promise<Campeonato> {
    await connectToDatabase();
    const created = await CampeonatoModel.create({
      nome: campeonato.nome,
      dataInicio: campeonato.dataInicio ?? null,
      diasDeJogo: [...campeonato.diasDeJogo],
      horarios: [...campeonato.horarios],
      taxaInscricao: campeonato.taxaInscricao ?? null,
      taxaArbitragem: campeonato.taxaArbitragem ?? null,
      status: campeonato.status,
    });
    return toEntity(created);
  }

  async update(campeonato: Campeonato): Promise<Campeonato> {
    await connectToDatabase();
    const updated = await CampeonatoModel.findByIdAndUpdate(
      campeonato.id,
      {
        nome: campeonato.nome,
        dataInicio: campeonato.dataInicio ?? null,
        diasDeJogo: [...campeonato.diasDeJogo],
        horarios: [...campeonato.horarios],
        taxaInscricao: campeonato.taxaInscricao ?? null,
        taxaArbitragem: campeonato.taxaArbitragem ?? null,
        status: campeonato.status,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Campeonato ${campeonato.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }
}

function toInscricaoEntity(doc: InscricaoCampeonatoDocument): InscricaoCampeonato {
  const state: InscricaoCampeonatoState = {
    id: doc.id as string,
    campeonatoId: doc.campeonatoId.toString(),
    atletaId: doc.atletaId.toString(),
    categoria: doc.categoria,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return InscricaoCampeonato.create(state);
}

export class MongoInscricaoCampeonatoRepository implements InscricaoCampeonatoRepository {
  async findByCampeonato(campeonatoId: string): Promise<InscricaoCampeonato[]> {
    await connectToDatabase();
    const docs = await InscricaoCampeonatoModel.find({ campeonatoId });
    return docs.map(toInscricaoEntity);
  }

  async findByAtleta(atletaId: string): Promise<InscricaoCampeonato[]> {
    await connectToDatabase();
    const docs = await InscricaoCampeonatoModel.find({ atletaId });
    return docs.map(toInscricaoEntity);
  }

  async create(inscricao: InscricaoCampeonato): Promise<InscricaoCampeonato> {
    await connectToDatabase();
    const created = await InscricaoCampeonatoModel.create({
      campeonatoId: inscricao.campeonatoId,
      atletaId: inscricao.atletaId,
      categoria: inscricao.categoria,
    });
    return toInscricaoEntity(created);
  }
}
