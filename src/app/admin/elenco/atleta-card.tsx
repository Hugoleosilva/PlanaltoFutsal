"use client";

import { useActionState, useState } from "react";
import { UserX, KeyRound } from "lucide-react";
import { ImageUpload } from "@/shared/components/image-upload";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  atualizarFotoAtletaAction,
  criarAcessoAtletaAction,
  desativarAtletaAction,
  type ActionState,
} from "./actions";

const INITIAL_STATE: ActionState = { error: null };

const POSICAO_LABEL: Record<string, string> = {
  GOLEIRO: "Goleiro",
  FIXO: "Fixo",
  ALA: "Ala",
  PIVO: "Pivô",
  LINHA: "Linha",
};

interface AtletaCardProps {
  id: string;
  nomeCompleto: string;
  apelido: string;
  idade: number;
  posicao: string | null;
  fotoPrincipalUrl: string | null;
  temAcesso: boolean;
}

export function AtletaCard({
  id,
  nomeCompleto,
  apelido,
  idade,
  posicao,
  fotoPrincipalUrl,
  temAcesso,
}: AtletaCardProps): React.ReactElement {
  const [foto, setFoto] = useState(fotoPrincipalUrl);
  const [mostrarAcesso, setMostrarAcesso] = useState(false);
  const [desativarState, desativarAction, isDesativando] = useActionState(
    desativarAtletaAction,
    INITIAL_STATE,
  );
  const [acessoState, acessoAction, isCriandoAcesso] = useActionState(
    criarAcessoAtletaAction,
    INITIAL_STATE,
  );

  async function handleFotoUploaded(url: string): Promise<void> {
    setFoto(url);
    await atualizarFotoAtletaAction(id, url);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-planalto-white">{apelido}</p>
          <p className="text-xs text-planalto-gray">{nomeCompleto}</p>
        </div>

        <form action={desativarAction}>
          <input type="hidden" name="atletaId" value={id} />
          <button
            type="submit"
            disabled={isDesativando}
            aria-label="Desativar atleta"
            className="text-planalto-gray transition hover:text-planalto-red disabled:opacity-50"
          >
            <UserX size={16} />
          </button>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{idade} anos</Badge>
        {posicao ? <Badge tone="neutral">{POSICAO_LABEL[posicao] ?? posicao}</Badge> : null}
        <Badge tone={temAcesso ? "success" : "warning"}>
          {temAcesso ? "Tem login" : "Sem login"}
        </Badge>
      </div>

      <div className="mt-4">
        <ImageUpload label="Foto de perfil" value={foto} onUploaded={handleFotoUploaded} />
      </div>

      {desativarState.error ? (
        <p className="mt-2 text-xs text-planalto-red">{desativarState.error}</p>
      ) : null}

      {!temAcesso ? (
        <div className="mt-4 border-t border-white/10 pt-4">
          {!mostrarAcesso ? (
            <Button variant="secondary" onClick={() => setMostrarAcesso(true)}>
              <KeyRound size={14} /> Criar acesso de login
            </Button>
          ) : (
            <form action={acessoAction} className="space-y-2">
              <input type="hidden" name="atletaId" value={id} />
              <Input name="email" type="email" placeholder="e-mail do atleta" required />
              <Input name="senha" type="password" placeholder="senha temporária" required minLength={8} />
              <div className="flex gap-2">
                <Button type="submit" disabled={isCriandoAcesso}>
                  {isCriandoAcesso ? "Criando..." : "Confirmar"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setMostrarAcesso(false)}>
                  Cancelar
                </Button>
              </div>
              {acessoState.error ? (
                <p className="text-xs text-planalto-red">{acessoState.error}</p>
              ) : null}
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
