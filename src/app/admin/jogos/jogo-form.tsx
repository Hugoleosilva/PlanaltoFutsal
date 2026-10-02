"use client";

import { useActionState, useState } from "react";
import { cadastrarJogoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";
import { ImageUpload } from "@/shared/components/image-upload";

const INITIAL_STATE: ActionState = { error: null };

export function JogoForm({
  campeonatos,
}: {
  campeonatos: { id: string; nome: string }[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarJogoAction, INITIAL_STATE);
  const [escudoAdversario, setEscudoAdversario] = useState<string | undefined>();

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Novo jogo</h2>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input type="hidden" name="adversarioEscudoUrl" value={escudoAdversario ?? ""} />

        <div className="space-y-1">
          <Label htmlFor="adversario">Adversário</Label>
          <Input id="adversario" name="adversario" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dataHora">Data e hora (opcional)</Label>
          <Input id="dataHora" name="dataHora" type="datetime-local" />
          <p className="text-xs text-planalto-gray">Deixe em branco se a data ainda não foi definida.</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="local">Local</Label>
          <Input id="local" name="local" required maxLength={200} />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="campeonatoId">Campeonato</Label>
          <Select id="campeonatoId" name="campeonatoId" defaultValue="">
            <option value="">Amistoso (sem campeonato)</option>
            {campeonatos.map((campeonato) => (
              <option key={campeonato.id} value={campeonato.id}>
                {campeonato.nome}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="mandante">Mando de campo</Label>
          <Select id="mandante" name="mandante" defaultValue="PLANALTO">
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

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-3">{state.error}</p>
        ) : null}

        <div className="sm:col-span-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Agendar jogo"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
