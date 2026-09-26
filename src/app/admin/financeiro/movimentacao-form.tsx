"use client";

import { useActionState } from "react";
import { registrarMovimentacaoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

export function MovimentacaoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(registrarMovimentacaoAction, INITIAL_STATE);

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Nova movimentação</h2>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="tipo">Tipo</Label>
          <Select id="tipo" name="tipo" defaultValue="RECEITA">
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input id="valor" name="valor" type="number" step="0.01" min="0" required />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" name="descricao" required maxLength={300} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="data">Data</Label>
          <Input id="data" name="data" type="date" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="categoria">Categoria (opcional)</Label>
          <Input id="categoria" name="categoria" placeholder="Ex: mensalidade, arbitragem..." />
        </div>

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Registrar movimentação"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
