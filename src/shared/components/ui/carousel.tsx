"use client";

import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({ children }: { children: ReactNode }): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right"): void {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const amount = track.clientWidth * 0.8;

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
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scroll-smooth px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Próximo"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
