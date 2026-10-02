"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { editarJogoAction, type ActionState } from "./actions";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { ImageUpload } from "@/shared/components/image-upload";
import { ConfrontoEscudos } from "../../_components/confronto-escudos";
import { tituloConfronto } from "../../_components/confronto-texto";
import { CancelarJogoButton } from "./cancelar-jogo-button";
import { ExcluirJogoButton } from "./excluir-jogo-button";
import { RegistrarResultadoForm } from "./registrar-resultado-form";

const INITIAL_STATE: ActionState = { error: null };

const STATUS_TONE: Record<string, "neutral" | "success" | "danger"> = {
  AGENDADO: "neutral",
  REALIZADO: "success",
  CANCELADO: "danger",
};

function formatDataHora(data?: Date | null): string {
  if (!data) return "Data e Hora ainda não definidas!";
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function toDatetimeLocalValue(data?: Date | null): string {
  if (!data) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}`;
}

export interface JogoRowData {
  id: string;
  adversario: string;
  adversarioEscudoUrl?: string | null;
  dataHora?: Date | null;
  local: string;
  campeonatoId?: string | null;
  status: "AGENDADO" | "REALIZADO" | "CANCELADO";
  placarPlanalto?: number | null;
  placarAdversario?: number | null;
  mandante: "PLANALTO" | "ADVERSARIO";
}

export function JogoRow({
  jogo,
  campeonatos,
  nomeCampeonato,
}: {
  jogo: JogoRowData;
  campeonatos: { id: string; nome: string }[];
  nomeCampeonato: string;
}): React.ReactElement {
  const [editando, setEditando] = useState(false);
  const [escudoAdversario, setEscudoAdversario] = useState<string | undefined>(
    jogo.adversarioEscudoUrl ?? undefined,
  );
  const [state, formAction, isPending] = useActionState(editarJogoAction, INITIAL_STATE);

  useEffect(() => {
    if (state !== INITIAL_STATE && !state.error) {
      setEditando(false);
    }
  }, [state]);

  if (editando) {
    return (
      <div className="space-y-4 py-4">
        <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input type="hidden" name="jogoId" value={jogo.id} />
          <input type="hidden" name="adversarioEscudoUrl" value={escudoAdversario ?? ""} />

          <div className="space-y-1">
            <Label htmlFor={`adversario-${jogo.id}`}>Adversário</Label>
            <Input
              id={`adversario-${jogo.id}`}
              name="adversario"
              required
              maxLength={150}
              defaultValue={jogo.adversario}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`dataHora-${jogo.id}`}>Data e hora (opcional)</Label>
            <Input
              id={`dataHora-${jogo.id}`}
              name="dataHora"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(jogo.dataHora)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`local-${jogo.id}`}>Local</Label>
            <Input id={`local-${jogo.id}`} name="local" required maxLength={200} defaultValue={jogo.local} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`campeonatoId-${jogo.id}`}>Campeonato</Label>
            <Select
              id={`campeonatoId-${jogo.id}`}
              name="campeonatoId"
              defaultValue={jogo.campeonatoId ?? ""}
            >
              <option value="">Amistoso (sem campeonato)</option>
              {campeonatos.map((campeonato) => (
                <option key={campeonato.id} value={campeonato.id}>
                  {campeonato.nome}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`mandante-${jogo.id}`}>Mando de campo</Label>
            <Select id={`mandante-${jogo.id}`} name="mandante" defaultValue={jogo.mandante}>
              <option value="PLANALTO">Planalto em casa</option>
              <option value="ADVERSARIO">Jogo fora (adversário manda)</option>
            </Select>
          </div>

          <div className="sm:col-span-3">
            <ImageUpload
              label="Escudo do adversário (opcional)"
              value={escudoAdversario}
              onUploaded={setEscudoAdversario}
            />
          </div>

          {state.error ? <p className="text-sm text-planalto-red sm:col-span-3">{state.error}</p> : null}

          <div className="flex gap-3 sm:col-span-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <ConfrontoEscudos adversarioEscudoUrl={jogo.adversarioEscudoUrl} mandante={jogo.mandante} />

        <div>
          <p className="text-sm font-medium text-planalto-white">
            {tituloConfronto(jogo.adversario, jogo.mandante)}
            {jogo.status === "REALIZADO" ? (
              <span className="ml-2 text-planalto-red">
                {jogo.mandante === "PLANALTO"
                  ? `${jogo.placarPlanalto} x ${jogo.placarAdversario}`
                  : `${jogo.placarAdversario} x ${jogo.placarPlanalto}`}
              </span>
            ) : null}
          </p>
          <p className="text-xs text-planalto-gray">
            {formatDataHora(jogo.dataHora)} · {jogo.local} · {nomeCampeonato}
            {jogo.mandante === "ADVERSARIO" ? " · Fora" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone={STATUS_TONE[jogo.status]}>{jogo.status}</Badge>
        {jogo.status === "AGENDADO" ? (
          <>
            <RegistrarResultadoForm jogoId={jogo.id} />
            <CancelarJogoButton id={jogo.id} />
          </>
        ) : null}
        <button
          type="button"
          onClick={() => setEditando(true)}
          aria-label="Editar jogo"
          className="text-planalto-gray transition hover:text-planalto-white"
        >
          <Pencil size={16} />
        </button>
        <ExcluirJogoButton id={jogo.id} />
      </div>
    </div>
  );
}
