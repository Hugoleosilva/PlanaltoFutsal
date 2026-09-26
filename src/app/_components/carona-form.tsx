"use client";

import { useActionState } from "react";
import { oferecerCaronaAction, type ActionState } from "../actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };

export function CaronaForm({
  jogos,
}: {
  jogos: { id: string; adversario: string }[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(oferecerCaronaAction, INITIAL_STATE);

  if (state.sucesso) {
    return (
      <Card className="mt-8 text-center">
        <p className="text-planalto-white">Carona registrada! Obrigado por ajudar a torcida. 🚗</p>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <h3 className="font-heading text-lg font-bold text-planalto-white">Oferecer carona</h3>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="jogoId">Jogo</Label>
          <Select id="jogoId" name="jogoId" required>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                Planalto Futsal x {jogo.adversario}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="motoristaNome">Seu nome</Label>
          <Input id="motoristaNome" name="motoristaNome" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contato">Contato (WhatsApp)</Label>
          <Input id="contato" name="contato" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="horarioSaida">Horário de saída</Label>
          <Input id="horarioSaida" name="horarioSaida" type="datetime-local" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="local">Local de saída</Label>
          <Input id="local" name="local" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="vagasDisponiveis">Vagas disponíveis</Label>
          <Input id="vagasDisponiveis" name="vagasDisponiveis" type="number" min="1" defaultValue={1} required />
        </div>

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Oferecer carona"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
