"use client";

import { useActionState, useState } from "react";
import { publicarServicoAction, type ActionState } from "../actions";
import { ImageUpload } from "@/shared/components/image-upload";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TelefoneInput } from "@/shared/components/ui/telefone-input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import { Collapsible } from "@/shared/components/ui/collapsible";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };
const MAX_IMAGENS = 2;

const FORMAS_PAGAMENTO = [
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "Pix" },
  { value: "CARTAO", label: "Cartão" },
];

export function PublicarServicoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(publicarServicoAction, INITIAL_STATE);
  const [imagens, setImagens] = useState<(string | undefined)[]>([undefined]);

  function adicionarSlot(): void {
    if (imagens.length < MAX_IMAGENS) setImagens((prev) => [...prev, undefined]);
  }

  function atualizarImagem(index: number, url: string): void {
    setImagens((prev) => prev.map((item, itemIndex) => (itemIndex === index ? url : item)));
  }

  const imagensPreenchidas = imagens.filter(Boolean);

  if (state.sucesso) {
    return (
      <Card className="text-center">
        <p className="text-planalto-white">
          Serviço enviado! Fica pendente até a diretoria aprovar. Valeu por divulgar seu trabalho 🙌
        </p>
      </Card>
    );
  }

  return (
    <Collapsible titulo="Divulgar meu trabalho">
      <form action={formAction} className="space-y-4">
        {imagens.map((url, index) => (
          <div key={index}>
            <ImageUpload
              label={`Foto ou arte do trabalho ${index + 1}`}
              value={url}
              onUploaded={(novaUrl) => atualizarImagem(index, novaUrl)}
            />
            {url ? <input type="hidden" name="imagemUrl" value={url} /> : null}
          </div>
        ))}

        {imagens.length < MAX_IMAGENS ? (
          <Button type="button" variant="ghost" onClick={adicionarSlot}>
            + Adicionar outra foto
          </Button>
        ) : null}

        <div className="space-y-1">
          <Label htmlFor="titulo">Título do serviço</Label>
          <Input id="titulo" name="titulo" required maxLength={150} placeholder="Ex: Corte de cabelo a domicílio" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea id="descricao" name="descricao" rows={3} required maxLength={1000} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="valores">Valores (opcional)</Label>
          <Input id="valores" name="valores" placeholder="Ex: A partir de R$ 25" />
        </div>

        <div className="space-y-1">
          <Label>Formas de pagamento</Label>
          <div className="flex flex-wrap gap-4">
            {FORMAS_PAGAMENTO.map((forma) => (
              <label key={forma.value} className="flex items-center gap-2 text-sm text-planalto-gray">
                <input
                  type="checkbox"
                  name="formasPagamento"
                  value={forma.value}
                  className="accent-planalto-red"
                />
                {forma.label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="nomeContato">Seu nome</Label>
          <Input id="nomeContato" name="nomeContato" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contato">Contato (WhatsApp)</Label>
          <TelefoneInput id="contato" name="contato" required />
        </div>

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

        <Button type="submit" disabled={isPending || imagensPreenchidas.length === 0} className="w-full">
          {isPending ? "Enviando..." : "Divulgar serviço"}
        </Button>
      </form>
    </Collapsible>
  );
}
