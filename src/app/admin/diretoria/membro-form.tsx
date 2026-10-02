"use client";

import { useActionState, useState } from "react";
import { cadastrarMembroDiretoriaAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TelefoneInput } from "@/shared/components/ui/telefone-input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import { ImageUpload } from "@/shared/components/image-upload";

const INITIAL_STATE: ActionState = { error: null };

export function MembroForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarMembroDiretoriaAction, INITIAL_STATE);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>();

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Novo membro da diretoria</h2>
      <p className="mt-1 text-xs text-planalto-gray">
        Aparece na página pública &quot;Diretoria&quot;, logo depois do Elenco no menu.
      </p>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input type="hidden" name="fotoUrl" value={fotoUrl ?? ""} />

        <div className="space-y-1">
          <Label htmlFor="nome-diretoria">Nome</Label>
          <Input id="nome-diretoria" name="nome" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="funcao">Função</Label>
          <Input id="funcao" name="funcao" required maxLength={100} placeholder="Ex: Presidente" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ordem">Ordem de exibição (opcional)</Label>
          <Input id="ordem" name="ordem" type="number" min="0" placeholder="0 aparece primeiro" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contato-diretoria">Contato (WhatsApp, opcional)</Label>
          <TelefoneInput id="contato-diretoria" name="contato" />
          <p className="text-xs text-planalto-gray">
            Usado na loja, pra torcida falar com a diretoria na hora de comprar.
          </p>
        </div>

        <div className="sm:col-span-2">
          <ImageUpload label="Foto" value={fotoUrl} onUploaded={setFotoUrl} />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="bio-diretoria">Bio / o que faz (opcional, máx. 330 caracteres)</Label>
          <Textarea id="bio-diretoria" name="bio" rows={3} maxLength={330} />
        </div>

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
