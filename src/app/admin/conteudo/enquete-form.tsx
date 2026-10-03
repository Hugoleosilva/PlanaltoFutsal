"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";
import { criarEnqueteAction, encerrarEnqueteAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Collapsible } from "@/shared/components/ui/collapsible";
import { Badge } from "@/shared/components/ui/badge";

const INITIAL_STATE: ActionState = { error: null };
const MIN_OPCOES = 2;
const MAX_OPCOES = 8;

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
  const [opcoes, setOpcoes] = useState(["", ""]);

  function atualizarOpcao(index: number, valor: string): void {
    setOpcoes((prev) => prev.map((item, itemIndex) => (itemIndex === index ? valor : item)));
  }

  function adicionarOpcao(): void {
    if (opcoes.length < MAX_OPCOES) setOpcoes((prev) => [...prev, ""]);
  }

  function removerOpcao(index: number): void {
    if (opcoes.length > MIN_OPCOES) setOpcoes((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Collapsible titulo="Enquete" abertoPorPadrao>
      {enqueteAtiva ? (
        <div className="space-y-3">
          <p className="text-sm text-foreground">{enqueteAtiva.pergunta}</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
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
        <form action={criarAction} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="pergunta">Pergunta</Label>
            <Input id="pergunta" name="pergunta" required />
          </div>

          <div className="space-y-1">
            <Label>Opções</Label>
            <div className="space-y-2">
              {opcoes.map((opcao, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    name="opcao"
                    value={opcao}
                    onChange={(event) => atualizarOpcao(index, event.target.value)}
                    placeholder={`Opção ${index + 1}`}
                    required
                  />
                  {opcoes.length > MIN_OPCOES ? (
                    <button
                      type="button"
                      onClick={() => removerOpcao(index)}
                      aria-label="Remover opção"
                      className="shrink-0 text-muted-foreground hover:text-planalto-red"
                    >
                      <X size={18} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {opcoes.length < MAX_OPCOES ? (
              <Button type="button" variant="ghost" onClick={adicionarOpcao}>
                + Adicionar opção
              </Button>
            ) : null}
          </div>

          {criarState.error ? <p className="text-sm text-planalto-red">{criarState.error}</p> : null}

          <Button type="submit" disabled={isCriando}>
            {isCriando ? "Criando..." : "Criar enquete"}
          </Button>
        </form>
      )}
    </Collapsible>
  );
}
