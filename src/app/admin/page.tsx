import { Card } from "@/shared/components/ui/card";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";
import { MongoMovimentacaoFinanceiraRepository } from "@/infrastructure/database/repositories/movimentacao-financeira.repository.mongo";
import { MongoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function AdminDashboardPage(): Promise<React.ReactElement> {
  const [atletas, fotosPendentes, movimentacoes, campeonatos, totalCadastros, totalApoiadores] =
    await Promise.all([
      new MongoAtletaRepository().findAllAtivos(),
      new MongoFotoRepository().findByStatus("PENDENTE_APROVACAO"),
      new MongoMovimentacaoFinanceiraRepository().findRecentes(100),
      new MongoCampeonatoRepository().findAll(),
      new MongoUserRepository().countAll(),
      new MongoUserRepository().countSocios(),
    ]);

  const saldo = movimentacoes.reduce((total, mov) => total + mov.valorComSinal, 0);

  const cards = [
    { label: "Atletas ativos", value: atletas.length },
    { label: "Fotos aguardando aprovação", value: fotosPendentes.length },
    { label: "Campeonatos cadastrados", value: campeonatos.length },
    { label: "Saldo (últimas movimentações)", value: formatBRL(saldo) },
    { label: "Cadastros no site", value: totalCadastros },
    { label: "Apoiadores (sócios)", value: totalApoiadores },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Visão Geral</h1>
        <p className="mt-1 text-planalto-gray">Resumo rápido do clube.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-planalto-gray">{card.label}</p>
            <p className="mt-2 font-heading text-3xl font-bold text-planalto-white">
              {card.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
