"use client";

import { useActionState, useEffect, useState } from "react";
import { votarEnqueteAction, type ActionState } from "../actions";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };

interface Opcao {
  id: string;
  texto: string;
  votos: number;
}

function chaveVotoLocal(enqueteId: string): string {
  return `planalto-futsal:votou-enquete:${enqueteId}`;
}

export function EnqueteVotoForm({
  enqueteId,
  opcoes,
}: {
  enqueteId: string;
  opcoes: Opcao[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(votarEnqueteAction, INITIAL_STATE);
  const [jaVotou, setJaVotou] = useState(false);

  useEffect(() => {
    try {
      setJaVotou(localStorage.getItem(chaveVotoLocal(enqueteId)) === "1");
    } catch {
      // localStorage indisponível (modo privado etc.) — segue sem lembrar o voto.
    }
  }, [enqueteId]);

  useEffect(() => {
    if (!state.sucesso) return;
    try {
      localStorage.setItem(chaveVotoLocal(enqueteId), "1");
    } catch {
      // ignora — apenas não vai lembrar que já votou nesta sessão
    }
    setJaVotou(true);
  }, [state.sucesso, enqueteId]);

  const totalVotos = opcoes.reduce((total, opcao) => total + opcao.votos, 0);

  if (jaVotou) {
    return <p className="text-sm text-planalto-white">Você já votou nesta enquete. Valeu! 🙌</p>;
  }

  return (
    <div className="space-y-2">
      {opcoes.map((opcao) => {
        const percentual = totalVotos > 0 ? Math.round((opcao.votos / totalVotos) * 100) : 0;

        return (
          <form key={opcao.id} action={formAction}>
            <input type="hidden" name="enqueteId" value={enqueteId} />
            <input type="hidden" name="opcaoId" value={opcao.id} />
            <button
              type="submit"
              disabled={isPending}
              className="relative w-full overflow-hidden rounded-md border border-white/10 px-3 py-2 text-left text-sm text-planalto-white transition hover:border-planalto-red disabled:opacity-60"
            >
              <span
                className="absolute inset-y-0 left-0 bg-planalto-red/20"
                style={{ width: `${percentual}%` }}
              />
              <span className="relative flex justify-between">
                <span>{opcao.texto}</span>
                <span className="text-planalto-gray">{percentual}%</span>
              </span>
            </button>
          </form>
        );
      })}

      {state.error ? <p className="text-xs text-planalto-red">{state.error}</p> : null}
    </div>
  );
}
