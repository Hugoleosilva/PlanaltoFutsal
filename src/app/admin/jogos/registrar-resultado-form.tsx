"use client";

import { useActionState, useState } from "react";
import { registrarResultadoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const INITIAL_STATE: ActionState = { error: null };

export function RegistrarResultadoForm({ jogoId }: { jogoId: string }): React.ReactElement {
  const [state, formAction, isPending] = useActionState(registrarResultadoAction, INITIAL_STATE);
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <Button variant="secondary" onClick={() => setAberto(true)}>
        Registrar placar
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="jogoId" value={jogoId} />
      <Input
        name="placarPlanalto"
        type="number"
        min="0"
        required
        placeholder="Nós"
        className="w-16 text-center"
      />
      <span className="text-planalto-gray">x</span>
      <Input
        name="placarAdversario"
        type="number"
        min="0"
        required
        placeholder="Eles"
        className="w-16 text-center"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Confirmar"}
      </Button>
      {state.error ? <p className="w-full text-xs text-planalto-red">{state.error}</p> : null}
    </form>
  );
}
