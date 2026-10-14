"use client";

import { useActionState } from "react";
import { promoverUsuarioDiretorAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

interface MembroSemAcesso {
  id: string;
  nome: string;
}

export function VincularUsuarioDiretoriaForm({
  membrosSemAcesso,
}: {
  membrosSemAcesso: MembroSemAcesso[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(promoverUsuarioDiretorAction, INITIAL_STATE);

  if (membrosSemAcesso.length === 0) return <></>;

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-foreground">
        Promover torcedor/atleta para diretor
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Para quem já tem conta no site e agora vai fazer parte da diretoria. Ele passa a entrar como
        ADMIN a partir do próximo login — se já for atleta, continua sendo também.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label htmlFor="termoBuscaDiretor">E-mail, WhatsApp ou nome da conta</Label>
          <Input id="termoBuscaDiretor" name="termoBusca" required className="min-w-[260px]" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="membroId">Vincular ao membro da diretoria</Label>
          <Select id="membroId" name="membroId" required className="min-w-[180px]">
            <option value="">Selecione...</option>
            {membrosSemAcesso.map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Vinculando..." : "Promover"}
        </Button>
      </form>

      {state.error ? <p className="mt-2 text-xs text-planalto-red">{state.error}</p> : null}
    </Card>
  );
}
