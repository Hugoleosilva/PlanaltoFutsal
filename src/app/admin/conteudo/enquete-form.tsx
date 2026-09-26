"use client";

import { useActionState } from "react";
import { criarEnqueteAction, encerrarEnqueteAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const INITIAL_STATE: ActionState = { error: null };

interface EnqueteAtual {
  id: string;
  pergunta: string;
  opcoes: { id: string; texto: string; votos: number }[];
}

export function EnqueteForm({ enqueteAtiva }: { enqueteAtiva: EnqueteAtual | null }): React.ReactElement {
  const [criarState, criarAction, isCriando] = useActionState(criarEnqueteAction, INITIAL_STATE);
  const [encerrarState, encerrarAction, isEncerrando] = useActionState(
    encerrarEnqueteAction,
    INITIAL_STATE,
  );

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Enquete</h2>

      {enqueteAtiva ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-planalto-white">{enqueteAtiva.pergunta}</p>
          <ul className="space-y-1 text-sm text-planalto-gray">
            {enqueteAtiva.opcoes.map((opcao) => (
              <li key={opcao.id} className="flex justify-between">
                <span>{opcao.texto}</span>
                <Badge>{opcao.votos} voto(s)</Badge>
              </li>
            ))}
          </ul>

          <form action={encerrarAction}>
            <input type="hidden" name="enqueteId" value={enqueteAtiva.id} />
            <Button type="submit" variant="secondary" disabled={isEncerrando}>
              {isEncerrando ? "Encerrando..." : "Encerrar enquete"}
            </Button>
          </form>
          {encerrarState.error ? (
            <p className="text-xs text-planalto-red">{encerrarState.error}</p>
          ) : null}
        </div>
      ) : (
        <form action={criarAction} className="mt-4 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="pergunta">Pergunta</Label>
            <Input id="pergunta" name="pergunta" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="opcoes">Opções (separadas por vírgula)</Label>
            <Input id="opcoes" name="opcoes" placeholder="Sim, Não, Talvez" required />
          </div>

          {criarState.error ? <p className="text-sm text-planalto-red">{criarState.error}</p> : null}

          <Button type="submit" disabled={isCriando}>
            {isCriando ? "Criando..." : "Criar enquete"}
          </Button>
        </form>
      )}
    </Card>
  );
}
