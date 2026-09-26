"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { excluirMovimentacaoAction, type ActionState } from "./actions";

const INITIAL_STATE: ActionState = { error: null };

export function DeleteMovimentacaoButton({ id }: { id: string }): React.ReactElement {
  const [state, formAction, isPending] = useActionState(excluirMovimentacaoAction, INITIAL_STATE);

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="movimentacaoId" value={id} />
      <button
        type="submit"
        disabled={isPending}
        aria-label="Excluir movimentação"
        className="text-planalto-gray transition hover:text-planalto-red disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
      {state.error ? <span className="text-xs text-planalto-red">{state.error}</span> : null}
    </form>
  );
}
