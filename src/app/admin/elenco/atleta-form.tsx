"use client";

import { useActionState } from "react";
import { cadastrarAtletaAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

const POSICOES = [
  { value: "", label: "Selecione (opcional)" },
  { value: "GOLEIRO", label: "Goleiro" },
  { value: "FIXO", label: "Fixo" },
  { value: "ALA", label: "Ala" },
  { value: "PIVO", label: "Pivô" },
  { value: "LINHA", label: "Linha" },
];

export function AtletaForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarAtletaAction, INITIAL_STATE);

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Novo atleta</h2>
      <p className="mt-1 text-xs text-planalto-gray">
        Informe o e-mail ou WhatsApp de contato: quando essa pessoa se cadastrar no site com o
        mesmo contato, ela já vira atleta automaticamente. A foto de perfil pode ser adicionada
        depois no card do atleta.
      </p>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="nomeCompleto">Nome completo</Label>
          <Input id="nomeCompleto" name="nomeCompleto" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="apelido">Como quer ser chamado</Label>
          <Input id="apelido" name="apelido" required maxLength={50} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dataNascimento">Data de nascimento</Label>
          <Input id="dataNascimento" name="dataNascimento" type="date" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="posicao">Posição</Label>
          <Select id="posicao" name="posicao" defaultValue="">
            {POSICOES.map((posicao) => (
              <option key={posicao.value} value={posicao.value}>
                {posicao.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="estiloDeJogo">Estilo de jogo</Label>
          <Input id="estiloDeJogo" name="estiloDeJogo" placeholder="Ex: velocidade, finalização..." />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contatoEmail">E-mail de contato (opcional)</Label>
          <Input id="contatoEmail" name="contatoEmail" type="email" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contatoWhatsapp">WhatsApp de contato (opcional)</Label>
          <Input id="contatoWhatsapp" name="contatoWhatsapp" placeholder="(81) 99999-9999" />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="bio">Bio / história</Label>
          <Textarea id="bio" name="bio" rows={3} />
        </div>

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Cadastrar atleta"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
