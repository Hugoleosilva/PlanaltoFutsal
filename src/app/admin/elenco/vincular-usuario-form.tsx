"use client";

import { useActionState } from "react";
import { promoverUsuarioAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

interface AtletaSemAcesso {
  id: string;
  apelido: string;
}

export function VincularUsuarioForm({
  atletasSemAcesso,
}: {
  atletasSemAcesso: AtletaSemAcesso[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(promoverUsuarioAction, INITIAL_STATE);

  if (atletasSemAcesso.length === 0) return <></>;

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">
        Promover torcedor para atleta
      </h2>
      <p className="mt-1 text-xs text-planalto-gray">
        Para quem já tem conta no site (torcedor) e agora vai jogar pelo time. Ele passa a entrar
        como atleta a partir do próximo login.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label htmlFor="userEmail">E-mail da conta do torcedor</Label>
          <Input id="userEmail" name="userEmail" type="email" required className="min-w-[220px]" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="atletaId">Vincular ao atleta</Label>
          <Select id="atletaId" name="atletaId" required className="min-w-[180px]">
            <option value="">Selecione...</option>
            {atletasSemAcesso.map((atleta) => (
              <option key={atleta.id} value={atleta.id}>
                {atleta.apelido}
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
