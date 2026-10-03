"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle(): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  const escuro = !montado || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="flex shrink-0 items-center justify-center rounded-full border border-surface/10 p-1.5 text-muted-foreground transition hover:text-foreground"
    >
      {escuro ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
