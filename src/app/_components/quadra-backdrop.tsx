"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/shared/utils/cn";

export function QuadraBackdrop({
  children,
  semRolagem = false,
}: {
  children: React.ReactNode;
  semRolagem?: boolean;
}): React.ReactElement {
  const { resolvedTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  const claro = montado && resolvedTheme === "light";

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col",
        semRolagem ? "h-screen overflow-hidden" : "min-h-screen",
      )}
    >
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/marca/fundo-tela-novo-planalto.jpg"
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className={cn("absolute inset-0", claro ? "bg-white/80" : "bg-black/70")} />
      </div>
      {children}
    </div>
  );
}
