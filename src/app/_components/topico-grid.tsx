"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/shared/components/ui/lightbox";

interface FotoItem {
  id: string;
  url: string;
  descricao?: string;
}

export function TopicoGrid({ fotos }: { fotos: FotoItem[] }): React.ReactElement {
  const [indiceAberto, setIndiceAberto] = useState<number | null>(null);
  const urls = fotos.map((foto) => foto.url);
  const legendas = fotos.map((foto) => foto.descricao);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {fotos.map((foto, index) => (
          <button
            key={foto.id}
            type="button"
            onClick={() => setIndiceAberto(index)}
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <Image
              src={foto.url}
              alt={foto.descricao ?? ""}
              fill
              className="object-cover object-top transition hover:scale-105"
              unoptimized
            />
          </button>
        ))}
      </div>

      {indiceAberto !== null ? (
        <Lightbox
          imagens={urls}
          legendas={legendas}
          indiceInicial={indiceAberto}
          onFechar={() => setIndiceAberto(null)}
        />
      ) : null}
    </>
  );
}
