"use client";

import { useActionState } from "react";
import { cadastrarJogoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

export function JogoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarJogoAction, INITIAL_STATE);

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Novo jogo</h2>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="adversario">Adversário</Label>
          <Input id="adversario" name="adversario" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dataHora">Data e hora</Label>
          <Input id="dataHora" name="dataHora" type="datetime-local" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="local">Local</Label>
          <Input id="local" name="local" required maxLength={200} />
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
