import {
  ContribuicaoSocio,
  ContribuicaoSocioState,
} from "@/core/domain/socio/contribuicao-socio.entity";
import { ContribuicaoSocioRepository } from "@/core/domain/socio/contribuicao-socio.repository";
import { connectToDatabase } from "../mongoose";
import { ContribuicaoSocioDocument, ContribuicaoSocioModel } from "../schemas/contribuicao-socio.schema";

function toEntity(doc: ContribuicaoSocioDocument): ContribuicaoSocio {
  const state: ContribuicaoSocioState = {
    id: doc.id as string,
    userId: doc.userId.toString(),
    tipo: doc.tipo,
    referencia: doc.referencia,
    valor: doc.valor,
    status: doc.status,
    dataVencimento: doc.dataVencimento,
    pagoEm: doc.pagoEm ?? null,
    movimentacaoFinanceiraId: doc.movimentacaoFinanceiraId ? doc.movimentacaoFinanceiraId.toString() : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return ContribuicaoSocio.create(state);
}

export class MongoContribuicaoSocioRepository implements ContribuicaoSocioRepository {
  async findById(id: string): Promise<ContribuicaoSocio | null> {
    await connectToDatabase();
    const doc = await ContribuicaoSocioModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findPendentePorUsuario(userId: string): Promise<ContribuicaoSocio | null> {
    await connectToDatabase();
    const doc = await ContribuicaoSocioModel.findOne({ userId, status: "PENDENTE" }).sort({
      dataVencimento: -1,
    });
    return doc ? toEntity(doc) : null;
  }

  async findByReferenciaUsuario(userId: string, referencia: string): Promise<ContribuicaoSocio | null> {
    await connectToDatabase();
    const doc = await ContribuicaoSocioModel.findOne({ userId, referencia });
    return doc ? toEntity(doc) : null;
  }

  async findAll(): Promise<ContribuicaoSocio[]> {
    await connectToDatabase();
    const docs = await ContribuicaoSocioModel.find().sort({ dataVencimento: -1 });
    return docs.map(toEntity);
  }

  async create(contribuicao: ContribuicaoSocio): Promise<ContribuicaoSocio> {
    await connectToDatabase();
    const created = await ContribuicaoSocioModel.create({
      userId: contribuicao.userId,
      tipo: contribuicao.tipo,
      referencia: contribuicao.referencia,
      valor: contribuicao.valor,
      status: contribuicao.status,
      dataVencimento: contribuicao.dataVencimento,
      pagoEm: contribuicao.pagoEm ?? null,
      movimentacaoFinanceiraId: contribuicao.movimentacaoFinanceiraId ?? null,
    });
    return toEntity(created);
  }

  async update(contribuicao: ContribuicaoSocio): Promise<ContribuicaoSocio> {
    await connectToDatabase();
    const updated = await ContribuicaoSocioModel.findByIdAndUpdate(
      contribuicao.id,
      {
        status: contribuicao.status,
        pagoEm: contribuicao.pagoEm ?? null,
        movimentacaoFinanceiraId: contribuicao.movimentacaoFinanceiraId ?? null,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Contribuição ${contribuicao.id} não encontrada para atualização.`);
    }

    return toEntity(updated);
  }
}
