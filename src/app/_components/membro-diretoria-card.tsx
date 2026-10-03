"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface MembroDiretoriaCardProps {
  nome: string;
  funcao: string;
  fotoUrl?: string | null;
  bio?: string;
}

export function MembroDiretoriaCard({
  nome,
  funcao,
  fotoUrl,
  bio,
}: MembroDiretoriaCardProps): React.ReactElement {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="flex h-full flex-col text-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface/10">
        {fotoUrl ? (
          <Image src={fotoUrl} alt="" fill className="object-cover object-top" unoptimized />
        ) : null}
      </div>

      <p className="mx-auto mt-2 inline-block rounded-md bg-surface/10 px-2.5 py-1 text-sm font-bold text-white">
        {nome}
      </p>

      <p className="mt-1.5 min-h-[2rem] text-xs text-planalto-gray">{funcao}</p>

      {bio ? (
        <div
          className={cn(
            "mt-2 flex flex-col rounded-lg border border-surface/10 bg-card text-left",
            aberto && "flex-1",
          )}
        >
          <button
            type="button"
            onClick={() => setAberto((prev) => !prev)}
            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-bold text-foreground"
          >
            Responsabilidades
            <ChevronDown size={14} className={cn("shrink-0 transition-transform", aberto && "rotate-180")} />
          </button>

          {aberto ? (
            <p className="max-h-28 flex-1 overflow-y-auto border-t border-surface/10 p-3 text-xs text-muted-foreground">
              {bio}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
