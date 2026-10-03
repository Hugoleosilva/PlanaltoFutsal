"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/shared/utils/cn";

export function ThemeToggle({
  sobreCor,
}: {
  /** Sobre um fundo fixo (cabeçalho/rodapé vermelho ou preto) — ícone fica branco fixo, não adapta ao tema. */
  sobreCor?: boolean;
}): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  const escuro = !montado || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border p-1.5 transition",
        sobreCor
          ? "border-white/20 text-white/80 hover:text-white"
          : "border-surface/10 text-muted-foreground hover:text-foreground",
      )}
    >
      {escuro ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
