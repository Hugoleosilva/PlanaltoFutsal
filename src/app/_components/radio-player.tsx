"use client";

import { Pause, Play, Radio } from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { ESTACOES_RADIO, useRadioPlayer } from "./radio-player-context";

export function RadioPlayer(): React.ReactElement {
  const { estacao, tocando, selecionarEstacao, alternarPlayPause } = useRadioPlayer();

  return (
    <div>
      <div className="flex items-center gap-2 text-planalto-white">
        <Radio size={18} />
        <h3 className="font-heading font-bold">Web Rádio</h3>
      </div>

      <div className="mt-3 space-y-2">
        <Select
          aria-label="Escolher estação de rádio"
          value={estacao.url}
          onChange={(event) => {
            const escolhida = ESTACOES_RADIO.find((item) => item.url === event.target.value);
            if (escolhida) selecionarEstacao(escolhida);
          }}
        >
          {ESTACOES_RADIO.map((item) => (
            <option key={item.url} value={item.url}>
              {item.label}
            </option>
          ))}
        </Select>

        <button
          type="button"
          onClick={alternarPlayPause}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-white/10 py-2 text-sm font-semibold text-planalto-white hover:bg-white/20"
        >
          {tocando ? <Pause size={16} /> : <Play size={16} />}
          {tocando ? "Pausar" : "Tocar"}
        </button>
      </div>
    </div>
  );
}
