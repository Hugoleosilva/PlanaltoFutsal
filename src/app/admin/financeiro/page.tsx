import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MongoMovimentacaoFinanceiraRepository } from "@/infrastructure/database/repositories/movimentacao-financeira.repository.mongo";
import { MovimentacaoForm } from "./movimentacao-form";
import { DeleteMovimentacaoButton } from "./delete-movimentacao-button";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(data: Date): string {
  return data.toLocaleDateString("pt-BR");
}

export default async function FinanceiroPage(): Promise<React.ReactElement> {
  const movimentacoes = await new MongoMovimentacaoFinanceiraRepository().findRecentes(100);
  const saldo = movimentacoes.reduce((total, mov) => total + mov.valorComSinal, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Financeiro</h1>
        <p className="mt-1 text-planalto-gray">
          Saldo atual: <span className="font-semibold text-planalto-white">{formatBRL(saldo)}</span>
        </p>
      </div>

      <MovimentacaoForm />

      <Card>
        <h2 className="font-heading text-lg font-bold text-planalto-white">Movimentações recentes</h2>

        {movimentacoes.length === 0 ? (
          <p className="mt-4 text-sm text-planalto-gray">Nenhuma movimentação registrada ainda.</p>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {movimentacoes.map((mov) => (
              <div key={mov.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-planalto-white">{mov.descricao}</p>
                  <p className="text-xs text-planalto-gray">
                    {formatData(mov.data)} {mov.categoria ? `· ${mov.categoria}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge tone={mov.tipo === "RECEITA" ? "success" : "danger"}>
                    {mov.tipo === "RECEITA" ? "+" : "-"}
                    {formatBRL(mov.valor)}
                  </Badge>
                  <DeleteMovimentacaoButton id={mov.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
