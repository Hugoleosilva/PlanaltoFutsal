import { ReactNode } from "react";

/**
 * Carrossel de rolagem contínua (sem fim) via animação CSS pura: duplica a
 * lista de itens uma vez e anima translateX de 0% a -50%, criando um loop
 * perfeito sem depender de nenhuma lib de carrossel.
 */
export function MarqueeCarousel({ children }: { children: ReactNode[] }): React.ReactElement {
  return (
    <div className="group overflow-hidden">
      <div className="flex w-max animate-marquee items-start gap-4 group-hover:[animation-play-state:paused]">
        {children}
        {children}
      </div>
    </div>
  );
}
