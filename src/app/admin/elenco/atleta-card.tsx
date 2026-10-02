"use client";

import { useActionState, useEffect, useState } from "react";
import { UserX, KeyRound, Pencil } from "lucide-react";
import { ImageUpload } from "@/shared/components/image-upload";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TelefoneInput } from "@/shared/components/ui/telefone-input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  atualizarFotoAtletaAction,
  criarAcessoAtletaAction,
  desativarAtletaAction,
  editarAtletaAction,
  type ActionState,
} from "./actions";
import { POSICOES_ATLETA, POSICAO_ATLETA_LABEL } from "@/shared/constants/posicoes-atleta";

const INITIAL_STATE: ActionState = { error: null };

function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const aniversarioJaPassou =
    hoje.getMonth() > dataNascimento.getMonth() ||
    (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() >= dataNascimento.getDate());
  if (!aniversarioJaPassou) idade -= 1;
  return idade;
}

function toDateInputValue(data: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

interface AtletaCardProps {
  id: string;
  nomeCompleto: string;
  apelido: string;
  dataNascimento: Date;
  posicao: string | null;
  bio: string;
  estiloDeJogo: string;
  contatoEmail: string;
  contatoWhatsapp: string;
  fotoPrincipalUrl: string | null;
  temAcesso: boolean;
}

export function AtletaCard({
  id,
  nomeCompleto,
  apelido,
  dataNascimento,
  posicao,
  bio,
  estiloDeJogo,
  contatoEmail,
  contatoWhatsapp,
  fotoPrincipalUrl,
  temAcesso,
}: AtletaCardProps): React.ReactElement {
  const [foto, setFoto] = useState(fotoPrincipalUrl);
  const [mostrarAcesso, setMostrarAcesso] = useState(false);
  const [editando, setEditando] = useState(false);
  const [desativarState, desativarAction, isDesativando] = useActionState(
    desativarAtletaAction,
    INITIAL_STATE,
  );
  const [acessoState, acessoAction, isCriandoAcesso] = useActionState(
    criarAcessoAtletaAction,
    INITIAL_STATE,
  );
  const [editarState, editarAction, isEditando] = useActionState(editarAtletaAction, INITIAL_STATE);

  useEffect(() => {
    if (editarState !== INITIAL_STATE && !editarState.error) {
      setEditando(false);
    }
  }, [editarState]);

  async function handleFotoUploaded(url: string): Promise<void> {
    setFoto(url);
    await atualizarFotoAtletaAction(id, url);
  }

  if (editando) {
    return (
      <div className="rounded-lg border border-white/10 bg-card p-4">
        <form action={editarAction} className="space-y-3">
          <input type="hidden" name="atletaId" value={id} />

          <div className="space-y-1">
            <Label htmlFor={`nomeCompleto-${id}`}>Nome completo</Label>
            <Input
              id={`nomeCompleto-${id}`}
              name="nomeCompleto"
              required
              maxLength={150}
              defaultValue={nomeCompleto}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`apelido-${id}`}>Como quer ser chamado</Label>
            <Input id={`apelido-${id}`} name="apelido" required maxLength={50} defaultValue={apelido} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`dataNascimento-${id}`}>Data de nascimento</Label>
            <Input
              id={`dataNascimento-${id}`}
              name="dataNascimento"
              type="date"
              required
              defaultValue={toDateInputValue(dataNascimento)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`posicao-${id}`}>Posição</Label>
            <Select id={`posicao-${id}`} name="posicao" defaultValue={posicao ?? ""}>
              <option value="">Selecione (opcional)</option>
              {POSICOES_ATLETA.map((item) => (
                <option key={item} value={item}>
                  {POSICAO_ATLETA_LABEL[item]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`estiloDeJogo-${id}`}>Estilo de jogo</Label>
            <Input id={`estiloDeJogo-${id}`} name="estiloDeJogo" defaultValue={estiloDeJogo} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`contatoEmail-${id}`}>E-mail de contato (opcional)</Label>
            <Input id={`contatoEmail-${id}`} name="contatoEmail" type="email" defaultValue={contatoEmail} />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`contatoWhatsapp-${id}`}>WhatsApp de contato (opcional)</Label>
            <TelefoneInput
              id={`contatoWhatsapp-${id}`}
              name="contatoWhatsapp"
              defaultValue={contatoWhatsapp}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`bio-${id}`}>Bio / história</Label>
            <Textarea id={`bio-${id}`} name="bio" rows={3} defaultValue={bio} />
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
          <p className="font-semibold text-planalto-white">{apelido}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditando(true)}
            aria-label="Editar atleta"
            className="text-planalto-gray transition hover:text-planalto-white"
          >
            <Pencil size={16} />
          </button>

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
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{calcularIdade(dataNascimento)} anos</Badge>
        {posicao ? (
          <Badge tone="neutral">
            {POSICAO_ATLETA_LABEL[posicao as keyof typeof POSICAO_ATLETA_LABEL] ?? posicao}
          </Badge>
        ) : null}
        <Badge tone={temAcesso ? "success" : "warning"}>
          {temAcesso ? "Tem login" : "Sem login"}
        </Badge>
      </div>

      <div className="mt-4">
        <ImageUpload value={foto} onUploaded={handleFotoUploaded} />
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
