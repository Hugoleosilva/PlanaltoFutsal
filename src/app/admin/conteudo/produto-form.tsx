"use client";

import { useActionState, useState } from "react";
import { cadastrarProdutoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";
import { ImageUpload } from "@/shared/components/image-upload";

const INITIAL_STATE: ActionState = { error: null };

export function ProdutoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarProdutoAction, INITIAL_STATE);
  const [imagemUrl, setImagemUrl] = useState<string | undefined>();

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Produto da loja</h2>

      <form action={formAction} className="mt-4 space-y-3">
        <input type="hidden" name="imagemUrl" value={imagemUrl ?? ""} />

        <ImageUpload label="Foto do produto" value={imagemUrl} onUploaded={setImagemUrl} />

        <div className="space-y-1">
          <Label htmlFor="nome-produto">Nome</Label>
          <Input id="nome-produto" name="nome" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="preco">Preço (R$, opcional)</Label>
          <Input id="preco" name="preco" type="number" step="0.01" min="0" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Input id="descricao" name="descricao" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="linkWhatsapp">Link do WhatsApp para comprar</Label>
          <Input
            id="linkWhatsapp"
            name="linkWhatsapp"
            type="url"
            placeholder="https://wa.me/5581999999999"
            required
          />
        </div>

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}
        {!imagemUrl ? <p className="text-xs text-planalto-gray">Envie a foto antes de salvar.</p> : null}

        <Button type="submit" disabled={isPending || !imagemUrl}>
          {isPending ? "Salvando..." : "Adicionar produto"}
        </Button>
      </form>
    </Card>
  );
}
