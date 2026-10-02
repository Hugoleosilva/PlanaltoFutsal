import { MongoMovimentacaoFinanceiraRepository } from "@/infrastructure/database/repositories/movimentacao-financeira.repository.mongo";
import { MovimentacaoForm } from "./movimentacao-form";
import { MovimentacoesList } from "./movimentacoes-list";
import { FinanceiroAnalytics } from "./financeiro-analytics";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FinanceiroPage(): Promise<React.ReactElement> {
  const movimentacoes = await new MongoMovimentacaoFinanceiraRepository().findRecentes(1000);
  const saldo = movimentacoes.reduce((total, mov) => total + mov.valorComSinal, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Financeiro</h1>
        <p className="mt-1 text-planalto-gray">
          Saldo Atual: <span className="font-semibold text-planalto-white">{formatBRL(saldo)}</span>
        </p>
      </div>

      <MovimentacaoForm />

      <FinanceiroAnalytics
        movimentacoes={movimentacoes.map((mov) => ({
          id: mov.id,
          tipo: mov.tipo,
          valor: mov.valor,
          data: mov.data.toISOString(),
          categoria: mov.categoria,
          origemReceita: mov.origemReceita,
        }))}
      />

      <MovimentacoesList
        movimentacoes={movimentacoes.map((mov) => ({
          id: mov.id,
          descricao: mov.descricao,
          data: mov.data,
          categoria: mov.categoria,
          tipo: mov.tipo,
          valor: mov.valor,
          comprovanteUrl: mov.comprovanteUrl,
        }))}
      />
    </div>
  );
}
