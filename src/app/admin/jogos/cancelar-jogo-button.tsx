"use client";

import { useActionState } from "react";
import { XCircle } from "lucide-react";
import { cancelarJogoAction, type ActionState } from "./actions";

const INITIAL_STATE: ActionState = { error: null };

export function CancelarJogoButton({ id }: { id: string }): React.ReactElement {
  const [, formAction, isPending] = useActionState(cancelarJogoAction, INITIAL_STATE);

  return (
    <form action={formAction}>
      <input type="hidden" name="jogoId" value={id} />
      <button
        type="submit"
        disabled={isPending}
        aria-label="Cancelar jogo"
        className="text-planalto-gray transition hover:text-planalto-red disabled:opacity-50"
      >
        <XCircle size={16} />
      </button>
    </form>
  );
}
