import Image from "next/image";
import { MongoProdutoRepository } from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export async function LojaSection(): Promise<React.ReactElement> {
  const produtos = await new MongoProdutoRepository().findAllAtivos();

  if (produtos.length === 0) return <></>;

  return (
    <section id="loja" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Loja Virtual
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {produtos.map((produto) => (
          <Card key={produto.id}>
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white/5">
              <Image src={produto.imagemUrl} alt={produto.nome} fill className="object-cover" unoptimized />
            </div>
            <p className="mt-3 font-semibold text-planalto-white">{produto.nome}</p>
            {produto.descricao ? (
              <p className="text-sm text-planalto-gray">{produto.descricao}</p>
            ) : null}
            {produto.preco ? (
              <p className="mt-1 text-planalto-red">{formatBRL(produto.preco)}</p>
            ) : null}

            <a href={produto.linkWhatsapp} target="_blank" rel="noopener noreferrer" className="mt-3 block">
              <Button className="w-full">Comprar no WhatsApp</Button>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}
