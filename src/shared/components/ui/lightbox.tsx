"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  imagens: string[];
  indiceInicial: number;
  alt?: string;
  legendas?: (string | undefined)[];
  onFechar: () => void;
}

export function Lightbox({
  imagens,
  indiceInicial,
  alt,
  legendas,
  onFechar,
}: LightboxProps): React.ReactElement {
  const [indice, setIndice] = useState(indiceInicial);

  function anterior(): void {
    setIndice((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  }

  function proximo(): void {
    setIndice((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      onClick={onFechar}
    >
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar"
        className="absolute right-4 top-4 text-white hover:text-planalto-red"
      >
        <X size={28} />
      </button>

      {imagens.length > 1 ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            anterior();
          }}
          aria-label="Anterior"
          className="absolute left-4 text-white hover:text-planalto-red"
        >
          <ChevronLeft size={32} />
        </button>
      ) : null}

      <div
        className="relative h-[80vh] w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image src={imagens[indice] ?? ""} alt={alt ?? ""} fill className="object-contain" unoptimized />

        {legendas?.[indice] ? (
          <p className="absolute bottom-4 left-1/2 max-w-[90%] -translate-x-1/2 rounded-md bg-black/70 px-4 py-2 text-center text-sm text-white">
            {legendas[indice]}
          </p>
        ) : null}
      </div>

      {imagens.length > 1 ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            proximo();
          }}
          aria-label="Próximo"
          className="absolute right-4 text-white hover:text-planalto-red"
        >
          <ChevronRight size={32} />
        </button>
      ) : null}
    </div>
  );
}
