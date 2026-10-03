import Link from "next/link";
import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import { ConfrontoEscudos } from "./confronto-escudos";
import { tituloConfronto } from "./confronto-texto";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatData(data?: Date | null): string {
  if (!data) return "Data e Hora ainda não definidas!";
  return data.toLocaleDateString("pt-BR", { timeZone: "America/Recife" });
}

export async function ResultadosSection({
  mes,
  ano,
}: {
  mes?: string;
  ano?: string;
}): Promise<React.ReactElement> {
  const todosOsJogos = await new MongoJogoRepository().findAll();

  const hoje = new Date();
  const abasDisponiveis = [
    ...new Set(
      todosOsJogos
        .filter((jogo) => jogo.status === "REALIZADO" && jogo.dataHora)
        .map((jogo) => `${jogo.dataHora!.getFullYear()}-${jogo.dataHora!.getMonth() + 1}`),
    ),
  ]
    .map((chave) => {
      const [anoChave, mesChave] = chave.split("-").map(Number);
      return { ano: anoChave as number, mes: mesChave as number };
    })
    .sort((a, b) => (a.ano === b.ano ? a.mes - b.mes : a.ano - b.ano));

  const abas =
    abasDisponiveis.length > 0
      ? abasDisponiveis
      : [{ ano: hoje.getFullYear(), mes: hoje.getMonth() + 1 }];

  const anoSelecionado = ano ? Number(ano) : (abas[abas.length - 1]?.ano ?? hoje.getFullYear());
  const mesSelecionado = mes ? Number(mes) : (abas[abas.length - 1]?.mes ?? hoje.getMonth() + 1);

  const resultados = todosOsJogos.filter(
    (jogo) =>
      jogo.status === "REALIZADO" &&
      jogo.dataHora &&
      jogo.dataHora.getFullYear() === anoSelecionado &&
      jogo.dataHora.getMonth() + 1 === mesSelecionado,
  );

  return (
    <section id="resultados">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Resultados Anteriores
      </h2>

      <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-2">
        {abas.map(({ ano: anoAba, mes: mesAba }) => {
          const ativo = anoAba === anoSelecionado && mesAba === mesSelecionado;
          return (
            <Link
              key={`${anoAba}-${mesAba}`}
              href={`/agenda?ano=${anoAba}&mes=${mesAba}#resultados`}
              className={cn(
                "shrink-0 rounded-md px-4 py-2 text-center text-sm font-semibold",
                ativo
                  ? "bg-planalto-red text-white"
                  : "bg-white/5 text-planalto-gray hover:bg-white/10",
              )}
            >
              <span className="block text-xs opacity-80">{anoAba}</span>
              {MESES[mesAba - 1]?.toUpperCase()}
            </Link>
          );
        })}
      </div>

      {resultados.length === 0 ? (
        <p className="mt-8 text-center text-sm text-planalto-gray">
          Nenhum resultado para esse período.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {resultados.map((jogo) => (
            <Card key={jogo.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <ConfrontoEscudos adversarioEscudoUrl={jogo.adversarioEscudoUrl} mandante={jogo.mandante} />
                <div className="min-w-0">
                  <p className="font-semibold text-planalto-white">
                    {tituloConfronto(jogo.adversario, jogo.mandante)}
                  </p>
                  <p className="text-sm text-planalto-gray">
                    {formatData(jogo.dataHora)} · {jogo.local}
                    {jogo.mandante === "ADVERSARIO" ? " · Fora" : ""}
                  </p>
                </div>
              </div>
              <Badge tone="success" className="shrink-0 whitespace-nowrap">
                {jogo.mandante === "PLANALTO"
                  ? `${jogo.placarPlanalto} x ${jogo.placarAdversario}`
                  : `${jogo.placarAdversario} x ${jogo.placarPlanalto}`}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
