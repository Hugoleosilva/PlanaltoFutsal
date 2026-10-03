"use client";

import { useActionState } from "react";
import { atualizarPerfilAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import { POSICOES_ATLETA, POSICAO_ATLETA_LABEL } from "@/shared/constants/posicoes-atleta";

const INITIAL_STATE: ActionState = { error: null };

const POSICOES = [
  { value: "", label: "Selecione (opcional)" },
  ...POSICOES_ATLETA.map((posicao) => ({ value: posicao, label: POSICAO_ATLETA_LABEL[posicao] })),
];

interface PerfilFormProps {
  apelido: string;
  bio?: string;
  posicao?: string | null;
  estiloDeJogo?: string;
  preferencias?: string;
}

export function PerfilForm({
  apelido,
  bio,
  posicao,
  estiloDeJogo,
  preferencias,
}: PerfilFormProps): React.ReactElement {
  const [state, formAction, isPending] = useActionState(atualizarPerfilAction, INITIAL_STATE);

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-foreground">Meu perfil</h2>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="apelido">Como quer ser chamado</Label>
          <Input id="apelido" name="apelido" defaultValue={apelido} maxLength={50} required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="posicao">Posição</Label>
          <Select id="posicao" name="posicao" defaultValue={posicao ?? ""}>
            {POSICOES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="estiloDeJogo">Estilo de jogo</Label>
          <Input id="estiloDeJogo" name="estiloDeJogo" defaultValue={estiloDeJogo ?? ""} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="preferencias">Preferências</Label>
          <Input id="preferencias" name="preferencias" defaultValue={preferencias ?? ""} />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="bio">Bio / história</Label>
          <Textarea id="bio" name="bio" rows={4} defaultValue={bio ?? ""} />
        </div>

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar perfil"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
