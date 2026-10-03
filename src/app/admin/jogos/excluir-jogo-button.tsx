"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { excluirJogoAction, type ActionState } from "./actions";

const INITIAL_STATE: ActionState = { error: null };

export function ExcluirJogoButton({ id }: { id: string }): React.ReactElement {
  const [, formAction, isPending] = useActionState(excluirJogoAction, INITIAL_STATE);

  return (
    <form action={formAction}>
      <input type="hidden" name="jogoId" value={id} />
      <button
        type="submit"
        disabled={isPending}
        aria-label="Excluir jogo"
        className="text-muted-foreground transition hover:text-planalto-red disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
