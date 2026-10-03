"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import {
  cadastrarPatrocinadorAction,
  editarPatrocinadorAction,
  desativarPatrocinadorAction,
  type ActionState,
} from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Collapsible } from "@/shared/components/ui/collapsible";
import { ImageUpload } from "@/shared/components/image-upload";

const INITIAL_STATE: ActionState = { error: null };

interface PatrocinadorItem {
  id: string;
  nome: string;
  logoUrl: string;
  depoimento?: string;
  link?: string;
  ordem: number;
  escala: number;
}

function EditarPatrocinadorControl({
  patrocinador,
}: {
  patrocinador: PatrocinadorItem;
}): React.ReactElement {
  const [editarState, editarAction, isEditando] = useActionState(editarPatrocinadorAction, INITIAL_STATE);
  const [desativarState, desativarAction, isDesativando] = useActionState(
    desativarPatrocinadorAction,
    INITIAL_STATE,
  );
  const [editando, setEditando] = useState(false);
  const [logoUrl, setLogoUrl] = useState(patrocinador.logoUrl);

  useEffect(() => {
    if (editarState !== INITIAL_STATE && editarState.sucesso) setEditando(false);
  }, [editarState]);

  if (!editando) {
    return (
      <div className="flex items-center gap-3 rounded-md bg-black/20 p-2">
        <Image
          src={patrocinador.logoUrl}
          alt=""
          width={64}
          height={48}
          className="h-12 w-16 shrink-0 rounded-md bg-surface/10 object-contain"
          unoptimized
        />
        <div className="flex-1">
          <p className="text-sm text-foreground">
            {patrocinador.nome}{" "}
            <span className="text-xs text-muted-foreground">
              (ordem {patrocinador.ordem} · {patrocinador.escala}%)
            </span>
          </p>
          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="text-xs font-semibold text-foreground underline hover:text-planalto-red"
            >
              Editar
            </button>
            <form action={desativarAction}>
              <input type="hidden" name="patrocinadorId" value={patrocinador.id} />
              <button
                type="submit"
                disabled={isDesativando}
                className="text-xs font-semibold text-planalto-red underline hover:text-planalto-red-dark disabled:opacity-50"
              >
                {isDesativando ? "Removendo..." : "Remover"}
              </button>
            </form>
          </div>
          {desativarState.error ? (
            <p className="mt-1 text-xs text-planalto-red">{desativarState.error}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form action={editarAction} className="space-y-3 rounded-md bg-black/20 p-3">
      <input type="hidden" name="patrocinadorId" value={patrocinador.id} />
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <ImageUpload label="Logo" value={logoUrl} onUploaded={setLogoUrl} />

      <div className="space-y-1">
        <Label>Nome</Label>
        <Input name="nome" required maxLength={150} defaultValue={patrocinador.nome} />
      </div>

      <div className="space-y-1">
        <Label>Link (opcional)</Label>
        <Input name="link" type="url" defaultValue={patrocinador.link} />
      </div>

      <div className="space-y-1">
        <Label>Depoimento (opcional)</Label>
        <Input name="depoimento" defaultValue={patrocinador.depoimento} />
      </div>

      <div className="space-y-1">
        <Label>Ordem de exibição</Label>
        <Input name="ordem" type="number" min="0" defaultValue={patrocinador.ordem} />
        <p className="text-xs text-muted-foreground">Quanto menor o número, mais cedo aparece.</p>
      </div>

      <div className="space-y-1">
        <Label>Tamanho do logo (%)</Label>
        <Input name="escala" type="number" min="50" max="200" defaultValue={patrocinador.escala} />
        <p className="text-xs text-muted-foreground">
          100% é o padrão. Aumente ou diminua pra igualar o tamanho visual entre logos diferentes.
        </p>
      </div>

      {editarState.error ? <p className="text-xs text-planalto-red">{editarState.error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={isEditando || !logoUrl}>
          {isEditando ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setEditando(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export function PatrocinadorForm({
  patrocinadores,
}: {
  patrocinadores: PatrocinadorItem[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarPatrocinadorAction, INITIAL_STATE);
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [mostrarLista, setMostrarLista] = useState(false);

  return (
    <Collapsible titulo="Patrocinador" abertoPorPadrao>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="logoUrl" value={logoUrl ?? ""} />

        <ImageUpload label="Logo" value={logoUrl} onUploaded={setLogoUrl} />

        <div className="space-y-1">
          <Label htmlFor="nome-patrocinador">Nome</Label>
          <Input id="nome-patrocinador" name="nome" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="link-patrocinador">Link (opcional)</Label>
          <Input id="link-patrocinador" name="link" type="url" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="depoimento">Depoimento (opcional)</Label>
          <Input id="depoimento" name="depoimento" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ordem-patrocinador">Ordem de exibição (opcional)</Label>
          <Input id="ordem-patrocinador" name="ordem" type="number" min="0" placeholder="0 aparece primeiro" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="escala-patrocinador">Tamanho do logo (%) (opcional)</Label>
          <Input
            id="escala-patrocinador"
            name="escala"
            type="number"
            min="50"
            max="200"
            placeholder="100"
          />
        </div>

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}
        {!logoUrl ? <p className="text-xs text-muted-foreground">Envie a logo antes de salvar.</p> : null}

        <Button type="submit" disabled={isPending || !logoUrl}>
          {isPending ? "Salvando..." : "Adicionar patrocinador"}
        </Button>
      </form>

      {patrocinadores.length > 0 ? (
        <div className="mt-4 border-t border-surface/10 pt-4">
          <button
            type="button"
            onClick={() => setMostrarLista((prev) => !prev)}
            className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
          >
            Editar patrocinadores ({patrocinadores.length})
            <span className="text-xs font-normal text-muted-foreground">
              {mostrarLista ? "Ocultar" : "Mostrar"}
            </span>
          </button>

          {mostrarLista ? (
            <div className="mt-3 space-y-2">
              {patrocinadores.map((patrocinador) => (
                <EditarPatrocinadorControl key={patrocinador.id} patrocinador={patrocinador} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </Collapsible>
  );
}
