"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Lightbox } from "@/shared/components/ui/lightbox";
import { ComprarProduto, type DiretorContato } from "./comprar-produto";

interface ProdutoCardProps {
  nome: string;
  descricao?: string;
  preco: number;
  imagensUrls: string[];
  diretores: DiretorContato[];
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProdutoCard({
  nome,
  descricao,
  preco,
  imagensUrls,
  diretores,
}: ProdutoCardProps): React.ReactElement {
  const [indice, setIndice] = useState(0);
  const [lightboxAberto, setLightboxAberto] = useState(false);

  function trocarImagem(direcao: 1 | -1): void {
    setIndice((prev) => (prev + direcao + imagensUrls.length) % imagensUrls.length);
  }

  return (
    <Card className="w-64 shrink-0 snap-start">
      <button
        type="button"
        onClick={() => setLightboxAberto(true)}
        className="relative block aspect-square w-full overflow-hidden rounded-md bg-surface/5"
      >
        <Image src={imagensUrls[indice] ?? ""} alt={nome} fill className="object-cover" unoptimized />
      </button>

      {imagensUrls.length > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => trocarImagem(-1)}
            aria-label="Foto anterior"
            className="hover:text-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          {indice === 0 ? "Frente" : indice === 1 ? "Verso" : `Foto ${indice + 1}`}
          <button
            type="button"
            onClick={() => trocarImagem(1)}
            aria-label="Próxima foto"
            className="hover:text-foreground"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}

      <p className="mt-3 font-semibold text-foreground">{nome}</p>
      {descricao ? <p className="text-sm text-muted-foreground">{descricao}</p> : null}
      <p className="mt-1 text-planalto-red">{formatBRL(preco)}</p>

      <ComprarProduto nomeProduto={nome} preco={preco} diretores={diretores} />

      {lightboxAberto ? (
        <Lightbox
          imagens={[...imagensUrls]}
          indiceInicial={indice}
          alt={nome}
          onFechar={() => setLightboxAberto(false)}
        />
      ) : null}
    </Card>
  );
}
