"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export function Collapsible({
  titulo,
  children,
  abertoPorPadrao = false,
}: {
  titulo: string;
  children: ReactNode;
  abertoPorPadrao?: boolean;
}): React.ReactElement {
  const [aberto, setAberto] = useState(abertoPorPadrao);

  return (
    <div className="rounded-lg border border-white/10 bg-card">
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-heading font-bold text-planalto-white"
      >
        {titulo}
        <ChevronDown size={18} className={cn("transition-transform", aberto && "rotate-180")} />
      </button>

      {aberto ? <div className="border-t border-white/10 p-5">{children}</div> : null}
    </div>
  );
}
