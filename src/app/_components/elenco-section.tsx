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

const TAMANHO_PAGINA = 12;

function paginar<T>(itens: T[], tamanho: number): T[][] {
  const paginas: T[][] = [];
  for (let i = 0; i < itens.length; i += tamanho) {
    paginas.push(itens.slice(i, i + tamanho));
  }
  return paginas;
}

function completarLinha<T>(pagina: T[]): (T | null)[] {
  const resto = pagina.length % 3;
  const faltam = resto === 0 ? 0 : 3 - resto;
  return [...pagina, ...Array<null>(faltam).fill(null)];
}

/**
 * O grid do CSS preenche por linha (esquerda->direita, cima->baixo). Pra
 * preencher por coluna (um atleta embaixo do outro, só passando pra coluna
 * seguinte quando a primeira estiver cheia), reordena os itens aqui antes
 * de renderizar no grid normal.
 */
function emOrdemDeColuna<T>(itens: T[], colunas: number): T[] {
  const linhas = Math.ceil(itens.length / colunas);
  const resultado: T[] = [];
  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      resultado.push(itens[coluna * linhas + linha] as T);
    }
  }
  return resultado;
}

function AtletaCardVazio(): React.ReactElement {
  return (
    <Card className="flex gap-3 p-4 opacity-40">
      <div className="h-20 w-20 shrink-0 rounded-lg bg-white/10" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <p className="font-heading font-bold text-planalto-white">Nome</p>
          <span className="shrink-0 text-xs text-planalto-gray">· 00 anos</span>
        </div>
        <div className="mt-1.5 flex justify-center">
          <Badge tone="neutral">Posição</Badge>
        </div>
      </div>
    </Card>
  );
}

function AtletaCard({ atleta }: { atleta: Atleta }): React.ReactElement {
  return (
    <Card className="flex gap-3 p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white/10">
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
          <div className="mt-1.5 flex justify-center">
            <Badge tone="neutral" className="whitespace-nowrap">
              {POSICAO_ATLETA_LABEL[atleta.posicao]}
            </Badge>
          </div>
        ) : null}
        {atleta.bio ? <p className="mt-1.5 line-clamp-2 text-xs text-planalto-gray">{atleta.bio}</p> : null}
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
    <section id="elenco" className="mx-auto max-w-5xl px-6 py-3">
      <h2 className="text-center font-heading text-2xl font-bold text-planalto-white">Nosso Elenco</h2>

      {campeonatosAtivos.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
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
            <div className="mt-3">
              <Carousel>
                {paginas.map((pagina, indice) => (
                  <div key={indice} className="w-full shrink-0 snap-start">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {emOrdemDeColuna(completarLinha(pagina), 3).map((atleta, posicao) =>
                        atleta ? (
                          <AtletaCard key={atleta.id} atleta={atleta} />
                        ) : (
                          <AtletaCardVazio key={`vazio-${posicao}`} />
                        ),
                      )}
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
