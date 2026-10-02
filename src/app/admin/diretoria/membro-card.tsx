"use client";

import { useActionState, useEffect, useState } from "react";
import { UserX, Pencil } from "lucide-react";
import { ImageUpload } from "@/shared/components/image-upload";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TelefoneInput } from "@/shared/components/ui/telefone-input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  atualizarFotoMembroDiretoriaAction,
  desativarMembroDiretoriaAction,
  editarMembroDiretoriaAction,
  type ActionState,
} from "./actions";

const INITIAL_STATE: ActionState = { error: null };

interface MembroCardProps {
  id: string;
  nome: string;
  funcao: string;
  fotoUrl: string | null;
  bio: string;
  ordem: number;
  contato?: string;
}

export function MembroCard({
  id,
  nome,
  funcao,
  fotoUrl,
  bio,
  ordem,
  contato,
}: MembroCardProps): React.ReactElement {
  const [foto, setFoto] = useState(fotoUrl);
  const [editando, setEditando] = useState(false);
  const [desativarState, desativarAction, isDesativando] = useActionState(
    desativarMembroDiretoriaAction,
    INITIAL_STATE,
  );
  const [editarState, editarAction, isEditando] = useActionState(editarMembroDiretoriaAction, INITIAL_STATE);

  useEffect(() => {
    if (editarState !== INITIAL_STATE && !editarState.error) setEditando(false);
  }, [editarState]);

  async function handleFotoUploaded(url: string): Promise<void> {
    setFoto(url);
    await atualizarFotoMembroDiretoriaAction(id, url);
  }

  if (editando) {
    return (
      <div className="rounded-lg border border-white/10 bg-card p-4">
        <form action={editarAction} className="space-y-3">
          <input type="hidden" name="membroId" value={id} />

          <div className="space-y-1">
            <Label htmlFor={`nome-${id}`}>Nome</Label>
            <Input id={`nome-${id}`} name="nome" required maxLength={150} defaultValue={nome} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`funcao-${id}`}>Função</Label>
            <Input id={`funcao-${id}`} name="funcao" required maxLength={100} defaultValue={funcao} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`ordem-${id}`}>Ordem de exibição</Label>
            <Input id={`ordem-${id}`} name="ordem" type="number" min="0" defaultValue={ordem} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`contato-${id}`}>Contato (WhatsApp)</Label>
            <TelefoneInput id={`contato-${id}`} name="contato" defaultValue={contato} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`bio-${id}`}>Bio / o que faz</Label>
            <Textarea id={`bio-${id}`} name="bio" rows={3} maxLength={330} defaultValue={bio} />
          </div>

          {editarState.error ? <p className="text-xs text-planalto-red">{editarState.error}</p> : null}

          <div className="flex gap-2">
            <Button type="submit" disabled={isEditando}>
              {isEditando ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-planalto-white">{nome}</p>
          <p className="text-xs text-planalto-gray">{funcao}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditando(true)}
            aria-label="Editar membro"
            className="text-planalto-gray transition hover:text-planalto-white"
          >
            <Pencil size={16} />
          </button>

          <form action={desativarAction}>
            <input type="hidden" name="membroId" value={id} />
            <button
              type="submit"
              disabled={isDesativando}
              aria-label="Desativar membro"
              className="text-planalto-gray transition hover:text-planalto-red disabled:opacity-50"
            >
              <UserX size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <ImageUpload value={foto} onUploaded={handleFotoUploaded} />
      </div>

      {bio ? <p className="mt-3 text-sm text-planalto-gray">{bio}</p> : null}

      {desativarState.error ? (
        <p className="mt-2 text-xs text-planalto-red">{desativarState.error}</p>
      ) : null}
    </div>
  );
}
