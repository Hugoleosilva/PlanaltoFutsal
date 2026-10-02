"use client";

import { Pause, Play } from "lucide-react";
import { useRadioPlayer } from "./radio-player-context";
import { cn } from "@/shared/utils/cn";

function OndaSonora({ ativa }: { ativa: boolean }): React.ReactElement {
  return (
    <div className="flex h-4 items-end gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map((barra) => (
        <span
          key={barra}
          className={cn(
            "block w-0.5 rounded-full bg-planalto-red",
            ativa ? "animate-onda-sonora" : "h-1 opacity-40",
          )}
          style={ativa ? { animationDelay: `${barra * 0.15}s` } : undefined}
        />
      ))}
    </div>
  );
}

export function RadioMiniBar(): React.ReactElement {
  const { estacao, tocando, alternarPlayPause } = useRadioPlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-planalto-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
        <button
          type="button"
          onClick={alternarPlayPause}
          aria-label={tocando ? "Pausar rádio" : "Tocar rádio"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-planalto-red text-white"
        >
          {tocando ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <OndaSonora ativa={tocando} />

        <p className="truncate text-sm text-planalto-white">
          <span className="text-planalto-gray">Web Rádio ·</span> {estacao.label}
        </p>
      </div>
    </div>
  );
}
