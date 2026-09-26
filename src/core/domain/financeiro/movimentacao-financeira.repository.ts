import { MovimentacaoFinanceira } from "./movimentacao-financeira.entity";

export interface MovimentacaoFinanceiraRepository {
  findById(id: string): Promise<MovimentacaoFinanceira | null>;
  findByPeriodo(inicio: Date, fim: Date): Promise<MovimentacaoFinanceira[]>;
  findRecentes(limite: number): Promise<MovimentacaoFinanceira[]>;
  create(movimentacao: MovimentacaoFinanceira): Promise<MovimentacaoFinanceira>;
  delete(id: string): Promise<void>;
}
