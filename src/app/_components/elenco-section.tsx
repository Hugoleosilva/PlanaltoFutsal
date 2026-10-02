import Image from "next/image";
import Link from "next/link";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import {
  MongoCampeonatoRepository,
  MongoInscricaoCampeonatoRepository,
} from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Carousel } from "@/shared/components/ui/carousel";
import { cn } from "@/shared/utils/cn";
import { POSICAO_ATLETA_LABEL } from "@/shared/constants/posicoes-atleta";
import type { Atleta } from "@/core/domain/atleta/atleta.entity";

const TAMANHO_PAGINA = 9;

function paginar<T>(itens: T[], tamanho: number): T[][] {
  const paginas: T[][] = [];
  for (let i = 0; i < itens.length; i += tamanho) {
    paginas.push(itens.slice(i, i + tamanho));
  }
  return paginas;
}

function AtletaCard({ atleta }: { atleta: Atleta }): React.ReactElement {
  return (
    <Card className="flex gap-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white/10">
        {atleta.fotoPrincipalUrl ? (
          <Image
            src={atleta.fotoPrincipalUrl}
            alt=""
            fill
            className="object-cover object-top"
            unoptimized
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <p className="truncate font-heading font-bold text-planalto-white">{atleta.apelido}</p>
          <span className="shrink-0 text-xs text-planalto-gray">· {atleta.idade} anos</span>
        </div>
        {atleta.posicao ? (
          <div className="mt-2 flex justify-center">
            <Badge tone="neutral" className="whitespace-nowrap">
              {POSICAO_ATLETA_LABEL[atleta.posicao]}
            </Badge>
          </div>
        ) : null}
        {atleta.bio ? <p className="mt-2 line-clamp-3 text-sm text-planalto-gray">{atleta.bio}</p> : null}
      </div>
    </Card>
  );
}

export async function ElencoSection({
  campeonatoFiltro,
}: {
  campeonatoFiltro?: string;
}): Promise<React.ReactElement> {
  const [todosAtletas, campeonatos] = await Promise.all([
    new MongoAtletaRepository().findAllAtivos(),
    new MongoCampeonatoRepository().findAll(),
  ]);

  const campeonatosAtivos = campeonatos.filter((campeonato) => campeonato.status !== "ENCERRADO");

  const campeonatoSelecionado = campeonatoFiltro
    ? campeonatosAtivos.find((campeonato) => campeonato.id === campeonatoFiltro)
    : undefined;

  let atletas = todosAtletas;
  if (campeonatoSelecionado) {
    const inscricoes = await new MongoInscricaoCampeonatoRepository().findByCampeonato(
      campeonatoSelecionado.id,
    );
    const atletaIdsInscritos = new Set(inscricoes.map((inscricao) => inscricao.atletaId));
    atletas = todosAtletas.filter((atleta) => atletaIdsInscritos.has(atleta.id));
  }

  return (
    <section id="elenco" className="mx-auto max-w-5xl px-6 py-6">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">Nosso Elenco</h2>

      {campeonatosAtivos.length > 0 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {campeonatoSelecionado ? (
            <Link
              href="/elenco"
              className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-planalto-white transition hover:bg-white/20"
            >
              Todos os atletas
            </Link>
          ) : null}
          {campeonatosAtivos.map((campeonato) => {
            const ativo = campeonato.id === campeonatoSelecionado?.id;
            return (
              <Link
                key={campeonato.id}
                href={ativo ? "/elenco" : `/elenco?campeonato=${campeonato.id}`}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition",
                  ativo
                    ? "bg-planalto-red text-white"
                    : "bg-white/10 text-planalto-white hover:bg-white/20",
                )}
              >
                {campeonato.nome}
              </Link>
            );
          })}
        </div>
      ) : null}

      {campeonatoSelecionado && atletas.length === 0 ? (
        <p className="mt-8 text-center text-sm text-planalto-gray">
          Nenhum atleta vinculado a esse campeonato ainda.
        </p>
      ) : atletas.length === 0 ? (
        <p className="mt-8 text-center text-sm text-planalto-gray">Elenco em atualização.</p>
      ) : (
        (() => {
          const paginas = paginar(atletas, TAMANHO_PAGINA);

          return (
            <div className="mt-4">
              <Carousel>
                {paginas.map((pagina, indice) => (
                  <div key={indice} className="w-full shrink-0 snap-start">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {pagina.map((atleta) => (
                        <AtletaCard key={atleta.id} atleta={atleta} />
                      ))}
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          );
        })()
      )}
    </section>
  );
}
