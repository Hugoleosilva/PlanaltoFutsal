"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

export interface EstacaoRadio {
  label: string;
  url: string;
}

export const ESTACOES_RADIO: EstacaoRadio[] = [
  { label: "Rock Clássico", url: "https://live.hunter.fm/rock_high" },
  { label: "Reggae", url: "https://streaming.hotmixradio.com/hotmix-reggae-en-mp3" },
  { label: "Samba & Pagode", url: "https://live.hunter.fm/pagode_high" },
  { label: "Sertanejo", url: "https://live.hunter.fm/sertanejo_high" },
  { label: "Hits Brasil / Trap & Funk", url: "https://live.hunter.fm/hitsbrasil_high" },
];

interface RadioPlayerContextValue {
  estacao: EstacaoRadio;
  tocando: boolean;
  selecionarEstacao: (estacao: EstacaoRadio) => void;
  alternarPlayPause: () => void;
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

export function RadioPlayerProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [estacao, setEstacao] = useState<EstacaoRadio>(ESTACOES_RADIO[0]!);
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function selecionarEstacao(novaEstacao: EstacaoRadio): void {
    setEstacao(novaEstacao);
    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.load();
      audio.play().catch(() => {});
    });
  }

  function alternarPlayPause(): void {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  return (
    <RadioPlayerContext.Provider value={{ estacao, tocando, selecionarEstacao, alternarPlayPause }}>
      {children}
      <audio
        ref={audioRef}
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        className="hidden"
      >
        <source src={estacao.url} />
      </audio>
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer(): RadioPlayerContextValue {
  const context = useContext(RadioPlayerContext);
  if (!context) throw new Error("useRadioPlayer precisa estar dentro de RadioPlayerProvider.");
  return context;
}
