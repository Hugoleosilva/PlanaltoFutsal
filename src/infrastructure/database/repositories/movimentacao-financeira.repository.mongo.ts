import {
  MovimentacaoFinanceira,
  MovimentacaoFinanceiraState,
} from "@/core/domain/financeiro/movimentacao-financeira.entity";
import { MovimentacaoFinanceiraRepository } from "@/core/domain/financeiro/movimentacao-financeira.repository";
import { connectToDatabase } from "../mongoose";
import {
  MovimentacaoFinanceiraDocument,
  MovimentacaoFinanceiraModel,
} from "../schemas/financeiro.schema";

function toEntity(doc: MovimentacaoFinanceiraDocument): MovimentacaoFinanceira {
  const state: MovimentacaoFinanceiraState = {
    id: doc.id as string,
    tipo: doc.tipo,
    descricao: doc.descricao,
    valor: doc.valor,
    data: doc.data,
    categoria: doc.categoria,
    campeonatoId: doc.campeonatoId ? doc.campeonatoId.toString() : null,
    registradoPorUserId: doc.registradoPorUserId.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return MovimentacaoFinanceira.create(state);
}

export class MongoMovimentacaoFinanceiraRepository implements MovimentacaoFinanceiraRepository {
  async findById(id: string): Promise<MovimentacaoFinanceira | null> {
    await connectToDatabase();
    const doc = await MovimentacaoFinanceiraModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByPeriodo(inicio: Date, fim: Date): Promise<MovimentacaoFinanceira[]> {
    await connectToDatabase();
    const docs = await MovimentacaoFinanceiraModel.find({
      data: { $gte: inicio, $lte: fim },
    }).sort({ data: -1 });
    return docs.map(toEntity);
  }

  async create(movimentacao: MovimentacaoFinanceira): Promise<MovimentacaoFinanceira> {
    await connectToDatabase();
    const created = await MovimentacaoFinanceiraModel.create({
      tipo: movimentacao.tipo,
      descricao: movimentacao.descricao,
      valor: movimentacao.valor,
      data: movimentacao.data,
      categoria: movimentacao.categoria,
      campeonatoId: movimentacao.campeonatoId ?? null,
      registradoPorUserId: movimentacao.registradoPorUserId,
    });
    return toEntity(created);
  }

  async delete(id: string): Promise<void> {
    await connectToDatabase();
    await MovimentacaoFinanceiraModel.findByIdAndDelete(id);
  }
}
