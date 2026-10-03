import Image from "next/image";
import { MongoProdutoRepository } from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import { MongoMembroDiretoriaRepository } from "@/infrastructure/database/repositories/membro-diretoria.repository.mongo";
import { Carousel } from "@/shared/components/ui/carousel";
import { MarqueeCarousel } from "@/shared/components/ui/marquee-carousel";
import { ProdutoCard } from "./produto-card";

export async function LojaSection(): Promise<React.ReactElement> {
  const [produtos, membrosDiretoria] = await Promise.all([
    new MongoProdutoRepository().findAllAtivos(),
    new MongoMembroDiretoriaRepository().findAllAtivos(),
  ]);

  if (produtos.length === 0) return <></>;

  const diretores = membrosDiretoria
    .filter((membro) => membro.contato)
    .map((membro) => ({ nome: membro.nome, contato: membro.contato as string }));

  const destaques = produtos.filter((produto) => produto.destaque);
  const semPreco = produtos.filter((produto) => !produto.destaque && !produto.preco);
  const comPreco = produtos.filter((produto) => !produto.destaque && Boolean(produto.preco));

  return (
    <section id="loja" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-foreground">
        Loja Virtual
      </h2>

      {destaques.length > 0 ? (
        <div className="mt-8">
          <MarqueeCarousel>
            {destaques.map((produto) => (
              <div
                key={produto.id}
                className="relative h-64 w-64 shrink-0 overflow-hidden rounded-lg bg-surface/5"
              >
                <Image
                  src={produto.imagensUrls[0] ?? ""}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2">
                  <p className="text-sm font-semibold text-white">{produto.nome}</p>
                </div>
              </div>
            ))}
          </MarqueeCarousel>
        </div>
      ) : null}

      {semPreco.length > 0 ? (
        <div className="mt-10">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Vitrine
          </h3>
          <Carousel>
            {semPreco.map((produto) => (
              <div
                key={produto.id}
                className="relative aspect-square w-48 shrink-0 snap-start overflow-hidden rounded-md bg-surface/5"
              >
                <Image
                  src={produto.imagensUrls[0] ?? ""}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </Carousel>
        </div>
      ) : null}

      {comPreco.length > 0 ? (
        <div className="mt-10">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Peças à venda
          </h3>
          <Carousel>
            {comPreco.map((produto) => (
              <ProdutoCard
                key={produto.id}
                nome={produto.nome}
                descricao={produto.descricao}
                preco={produto.preco as number}
                imagensUrls={[...produto.imagensUrls]}
                diretores={diretores}
              />
            ))}
          </Carousel>
        </div>
      ) : null}
    </section>
  );
}
