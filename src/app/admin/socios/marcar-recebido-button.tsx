"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { marcarContribuicaoRecebidaAction, type ActionState } from "./actions";

const INITIAL_STATE: ActionState = { error: null };

export function MarcarRecebidoButton({ contribuicaoId }: { contribuicaoId: string }): React.ReactElement {
  const [state, formAction, isPending] = useActionState(marcarContribuicaoRecebidaAction, INITIAL_STATE);

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="contribuicaoId" value={contribuicaoId} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-planalto-white transition hover:bg-white/20 disabled:opacity-50"
      >
        <CheckCircle2 size={14} />
        {isPending ? "Marcando..." : "Marcar como recebido"}
      </button>
      {state.error ? <span className="text-xs text-planalto-red">{state.error}</span> : null}
    </form>
  );
}
