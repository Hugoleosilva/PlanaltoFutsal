"use client";

import { useActionState } from "react";
import { criarCampeonatoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

export function CampeonatoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(criarCampeonatoAction, INITIAL_STATE);

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Novo campeonato</h2>
      <p className="mt-1 text-xs text-planalto-gray">
        Só o nome é obrigatório — preencha o resto quando souber.
      </p>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="nome">Nome do campeonato</Label>
          <Input id="nome" name="nome" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dataInicio">Data de início</Label>
          <Input id="dataInicio" name="dataInicio" type="date" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="diasDeJogo">Dias de jogo (separados por vírgula)</Label>
          <Input id="diasDeJogo" name="diasDeJogo" placeholder="Sábado, Domingo" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="horarios">Horários (separados por vírgula)</Label>
          <Input id="horarios" name="horarios" placeholder="09:00, 15:00" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="taxaInscricao">Taxa de inscrição (R$)</Label>
          <Input id="taxaInscricao" name="taxaInscricao" type="number" step="0.01" min="0" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="taxaArbitragem">Taxa de arbitragem (R$)</Label>
          <Input id="taxaArbitragem" name="taxaArbitragem" type="number" step="0.01" min="0" />
        </div>

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Criar campeonato"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
