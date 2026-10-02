"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { aprovarFotoAction, rejeitarFotoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";

const INITIAL_STATE: ActionState = { error: null };

interface FotoCardProps {
  id: string;
  url: string;
  descricao?: string;
  categoria: string;
  enviadoPorNome?: string;
}

export function FotoCard({ id, url, descricao, categoria, enviadoPorNome }: FotoCardProps): React.ReactElement {
  const [aprovarState, aprovarAction, isAprovando] = useActionState(aprovarFotoAction, INITIAL_STATE);
  const [rejeitarState, rejeitarAction, isRejeitando] = useActionState(rejeitarFotoAction, INITIAL_STATE);

  const isPending = isAprovando || isRejeitando;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-card">
      <div className="relative aspect-square w-full bg-black/40">
        <Image src={url} alt={descricao ?? ""} fill className="object-cover object-top" unoptimized />
      </div>

      <div className="space-y-2 p-4">
        <p className="text-xs text-planalto-gray">
          {categoria === "ANTIGA" ? "Foto antiga" : "Foto atual"}
          {enviadoPorNome ? ` · enviada por ${enviadoPorNome}` : ""}
        </p>
        {descricao ? <p className="text-sm text-planalto-white">{descricao}</p> : null}

        <div className="flex gap-2 pt-2">
          <form action={aprovarAction} className="flex-1">
            <input type="hidden" name="fotoId" value={id} />
            <Button type="submit" variant="primary" disabled={isPending} className="w-full">
              <Check size={16} /> Aprovar
            </Button>
          </form>

          <form action={rejeitarAction} className="flex-1">
            <input type="hidden" name="fotoId" value={id} />
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
