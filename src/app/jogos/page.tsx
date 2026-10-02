import Link from "next/link";
import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { PatrocinadoresSection } from "../_components/patrocinadores-section";
import { PublicFooter } from "../_components/public-footer";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import { ConfrontoEscudos } from "../_components/confronto-escudos";
import { tituloConfronto } from "../_components/confronto-texto";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatData(data?: Date | null): string {
  if (!data) return "Data e Hora ainda não definidas!";
  return data.toLocaleDateString("pt-BR");
}

interface JogosPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

export default async function JogosPage({ searchParams }: JogosPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
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
      const [ano, mes] = chave.split("-").map(Number);
      return { ano: ano as number, mes: mes as number };
    })
    .sort((a, b) => (a.ano === b.ano ? a.mes - b.mes : a.ano - b.ano));

  const abas =
    abasDisponiveis.length > 0
      ? abasDisponiveis
      : [{ ano: hoje.getFullYear(), mes: hoje.getMonth() + 1 }];

  const anoSelecionado = params.ano ? Number(params.ano) : (abas[abas.length - 1]?.ano ?? hoje.getFullYear());
  const mesSelecionado = params.mes ? Number(params.mes) : (abas[abas.length - 1]?.mes ?? hoje.getMonth() + 1);

  const resultados = todosOsJogos.filter(
    (jogo) =>
      jogo.status === "REALIZADO" &&
      jogo.dataHora &&
      jogo.dataHora.getFullYear() === anoSelecionado &&
      jogo.dataHora.getMonth() + 1 === mesSelecionado,
  );

  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-center font-heading text-3xl font-bold text-planalto-gray">
          Jogos e Resultados
        </h1>

        <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-2">
          {abas.map(({ ano, mes }) => {
            const ativo = ano === anoSelecionado && mes === mesSelecionado;
            return (
              <Link
                key={`${ano}-${mes}`}
                href={`/jogos?ano=${ano}&mes=${mes}`}
                className={cn(
                  "shrink-0 rounded-md px-4 py-2 text-center text-sm font-semibold",
                  ativo
                    ? "bg-planalto-red text-white"
                    : "bg-white/5 text-planalto-gray hover:bg-white/10",
                )}
              >
                <span className="block text-xs opacity-80">{ano}</span>
                {MESES[mes - 1]?.toUpperCase()}
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
                <div className="flex items-center gap-3">
                  <ConfrontoEscudos adversarioEscudoUrl={jogo.adversarioEscudoUrl} mandante={jogo.mandante} />
                  <div>
                    <p className="font-semibold text-planalto-white">
                      {tituloConfronto(jogo.adversario, jogo.mandante)}
                    </p>
                    <p className="text-sm text-planalto-gray">
                      {formatData(jogo.dataHora)} · {jogo.local}
                      {jogo.mandante === "ADVERSARIO" ? " · Fora" : ""}
                    </p>
                  </div>
                </div>
                <Badge tone="success">
                  {jogo.mandante === "PLANALTO"
                    ? `${jogo.placarPlanalto} x ${jogo.placarAdversario}`
                    : `${jogo.placarAdversario} x ${jogo.placarPlanalto}`}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </main>

      <PatrocinadoresSection />
      <PublicFooter />
    </>
  );
}
