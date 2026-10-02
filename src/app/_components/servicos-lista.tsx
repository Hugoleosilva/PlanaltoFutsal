import Image from "next/image";
import Link from "next/link";
import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import {
  CATEGORIAS_SERVICO,
  CATEGORIA_SERVICO_LABEL,
  type CategoriaServico,
} from "@/shared/constants/categorias-servico";

const FORMA_LABEL: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO: "Cartão",
};

export async function ServicosLista({
  categoriaFiltro,
}: {
  categoriaFiltro?: string;
}): Promise<React.ReactElement> {
  const todosOsServicos = await new MongoServicoRepository().findByStatus("APROVADO");

  const categoriaAtiva = CATEGORIAS_SERVICO.includes(categoriaFiltro as CategoriaServico)
    ? (categoriaFiltro as CategoriaServico)
    : undefined;

  const servicos = categoriaAtiva
    ? todosOsServicos.filter((servico) => servico.categoria === categoriaAtiva)
    : todosOsServicos;

  return (
    <div>
      {todosOsServicos.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/servicos"
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition",
              !categoriaAtiva
                ? "bg-planalto-red text-white"
                : "bg-white/10 text-planalto-white hover:bg-white/20",
            )}
          >
            Todas
          </Link>
          {CATEGORIAS_SERVICO.map((categoria) => (
            <Link
              key={categoria}
              href={`/servicos?categoria=${categoria}`}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition",
                categoriaAtiva === categoria
                  ? "bg-planalto-red text-white"
                  : "bg-white/10 text-planalto-white hover:bg-white/20",
              )}
            >
              {CATEGORIA_SERVICO_LABEL[categoria]}
            </Link>
          ))}
        </div>
      ) : null}

      {servicos.length === 0 ? (
        <p className="mt-8 text-center text-sm text-planalto-gray">
          {todosOsServicos.length === 0
            ? "Nenhum serviço divulgado ainda. Seja o primeiro!"
            : "Nenhum serviço nessa categoria ainda."}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico) => (
            <div key={servico.id} className="overflow-hidden rounded-lg border border-white/10 bg-card p-4">
              <div className="flex justify-center gap-2">
                {servico.imagensUrls.map((url, index) => (
                  <div
                    key={url}
                    className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-md bg-black/40"
                  >
                    <Image
                      src={url}
                      alt={`${servico.titulo} ${index + 1}`}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                ))}
              </div>

              <p className="mt-3 text-center font-heading font-bold text-planalto-white">
                {servico.titulo} — {servico.nomeContato}
              </p>

              <p className="mt-2 text-center text-sm text-planalto-gray">{servico.descricao}</p>

              {servico.valores ? (
                <p className="mt-2 text-center text-sm text-planalto-red">{servico.valores}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <Badge tone="neutral">{CATEGORIA_SERVICO_LABEL[servico.categoria]}</Badge>
                {servico.formasPagamento.map((forma) => (
                  <Badge key={forma}>{FORMA_LABEL[forma] ?? forma}</Badge>
                ))}
              </div>

              <p className="mt-3 rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold text-white">
                Agende seu Orçamento:{" "}
                <span className="whitespace-nowrap">
                  {servico.contato} ({servico.nomeContato})
                </span>
                <br />
                <span className="font-normal text-planalto-gray">{servico.bairro}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
