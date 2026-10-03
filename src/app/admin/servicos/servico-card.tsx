"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { aprovarServicoAction, rejeitarServicoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CATEGORIA_SERVICO_LABEL, type CategoriaServico } from "@/shared/constants/categorias-servico";

const INITIAL_STATE: ActionState = { error: null };

const FORMA_LABEL: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO: "Cartão",
};

interface ServicoCardProps {
  id: string;
  titulo: string;
  descricao: string;
  imagensUrls: string[];
  valores?: string;
  formasPagamento: string[];
  categoria: CategoriaServico;
  bairro: string;
  nomeContato: string;
  contato: string;
}

export function ServicoCard({
  id,
  titulo,
  descricao,
  imagensUrls,
  valores,
  formasPagamento,
  categoria,
  bairro,
  nomeContato,
  contato,
}: ServicoCardProps): React.ReactElement {
  const [aprovarState, aprovarAction, isAprovando] = useActionState(aprovarServicoAction, INITIAL_STATE);
  const [rejeitarState, rejeitarAction, isRejeitando] = useActionState(
    rejeitarServicoAction,
    INITIAL_STATE,
  );

  const isPending = isAprovando || isRejeitando;

  return (
    <div className="overflow-hidden rounded-lg border border-surface/10 bg-card">
      <div className="flex gap-2 bg-black/40 p-2">
        {imagensUrls.map((url, index) => (
          <div key={url} className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image
              src={url}
              alt={`${titulo} ${index + 1}`}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 p-4">
        <p className="font-semibold text-foreground">{titulo}</p>
        <p className="text-sm text-muted-foreground">{descricao}</p>
        {valores ? <p className="text-sm text-planalto-red">{valores}</p> : null}

        <div className="flex flex-wrap gap-1.5">
          <Badge tone="neutral">{CATEGORIA_SERVICO_LABEL[categoria]}</Badge>
          {formasPagamento.map((forma) => (
            <Badge key={forma}>{FORMA_LABEL[forma] ?? forma}</Badge>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {nomeContato} · <span className="whitespace-nowrap">{contato}</span> · {bairro}
        </p>

        <div className="flex gap-2 pt-2">
          <form action={aprovarAction} className="flex-1">
            <input type="hidden" name="servicoId" value={id} />
            <Button type="submit" variant="primary" disabled={isPending} className="w-full">
              <Check size={16} /> Aprovar
            </Button>
          </form>

          <form action={rejeitarAction} className="flex-1">
            <input type="hidden" name="servicoId" value={id} />
            <Button type="submit" variant="danger" disabled={isPending} className="w-full">
              <X size={16} /> Rejeitar
            </Button>
          </form>
        </div>

        {aprovarState.error || rejeitarState.error ? (
          <p className="text-xs text-planalto-red">{aprovarState.error ?? rejeitarState.error}</p>
        ) : null}
      </div>
    </div>
  );
}
