"use client";

import { useActionState, useState } from "react";
import { cadastrarProdutoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Collapsible } from "@/shared/components/ui/collapsible";
import { ImageUpload } from "@/shared/components/image-upload";

const INITIAL_STATE: ActionState = { error: null };
const MAX_IMAGENS = 4;

export function ProdutoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarProdutoAction, INITIAL_STATE);
  const [imagens, setImagens] = useState<(string | undefined)[]>([undefined, undefined]);

  function atualizarImagem(index: number, url: string): void {
    setImagens((prev) => prev.map((item, itemIndex) => (itemIndex === index ? url : item)));
  }

  function adicionarSlot(): void {
    if (imagens.length < MAX_IMAGENS) setImagens((prev) => [...prev, undefined]);
  }

  const imagensPreenchidas = imagens.filter(Boolean);

  return (
    <Collapsible titulo="Produto da loja" abertoPorPadrao>
      <p className="mb-3 text-xs text-muted-foreground">
        Pra roupas, use 2 fotos (frente e verso). Deixe o preço em branco pra mostrar só como
        vitrine, sem preço.
      </p>

      <form action={formAction} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {imagens.map((url, index) => (
            <div key={index}>
              {url ? <input type="hidden" name="imagemUrl" value={url} /> : null}
              <ImageUpload
                label={index === 0 ? "Frente" : index === 1 ? "Verso" : `Foto ${index + 1}`}
                value={url}
                onUploaded={(novaUrl) => atualizarImagem(index, novaUrl)}
              />
            </div>
          ))}
        </div>

        {imagens.length < MAX_IMAGENS ? (
          <Button type="button" variant="ghost" onClick={adicionarSlot}>
            + Adicionar outra foto
          </Button>
        ) : null}

        <div className="space-y-1">
          <Label htmlFor="nome-produto">Nome</Label>
          <Input id="nome-produto" name="nome" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="preco">Preço (R$, opcional — deixe em branco pra vitrine sem preço)</Label>
          <Input id="preco" name="preco" type="number" step="0.01" min="0" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Input id="descricao" name="descricao" />
        </div>

        <p className="text-xs text-muted-foreground">
          Quem quiser comprar vai poder falar com um dos diretores (cadastrados em &quot;Diretoria&quot;) ou
          gerar um Pix direto na loja — não precisa mais de link de WhatsApp aqui.
        </p>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" name="destaque" className="accent-planalto-red" />
          Mostrar em destaque (carrossel no topo da loja)
        </label>

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}
        {imagensPreenchidas.length === 0 ? (
          <p className="text-xs text-muted-foreground">Envie ao menos uma foto antes de salvar.</p>
        ) : null}

        <Button type="submit" disabled={isPending || imagensPreenchidas.length === 0}>
          {isPending ? "Salvando..." : "Adicionar produto"}
        </Button>
      </form>
    </Collapsible>
  );
}
