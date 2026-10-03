"use client";

import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export function Carousel({
  children,
  paginas = false,
}: {
  children: ReactNode;
  /** Modo "página cheia": slides ocupam 100% da largura, sem espiar o vizinho. */
  paginas?: boolean;
}): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right"): void {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const amount = paginas ? track.clientWidth : track.clientWidth * 0.8;

    if (direction === "right" && track.scrollLeft >= maxScroll - 2) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === "left" && track.scrollLeft <= 2) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className={cn(
          "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80",
          paginas ? "left-1" : "left-0",
        )}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={trackRef}
        className={cn(
          "flex snap-x snap-mandatory items-start overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          paginas ? "gap-0 px-0" : "gap-4 px-10",
        )}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Próximo"
        className={cn(
          "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80",
          paginas ? "right-1" : "right-0",
        )}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
