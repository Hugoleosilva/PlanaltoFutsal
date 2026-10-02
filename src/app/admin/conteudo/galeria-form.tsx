"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  publicarFotoGaleriaAction,
  criarTopicoGaleriaAction,
  marcarFotoDestaqueAction,
  atribuirTopicoFotoAction,
  type ActionState,
} from "./actions";
import { ImageUpload } from "@/shared/components/image-upload";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Collapsible } from "@/shared/components/ui/collapsible";
import { cn } from "@/shared/utils/cn";

const INITIAL_STATE: ActionState = { error: null };
const MAX_FOTOS = 5;
const MAX_DESTAQUES = 3;

interface TopicoItem {
  id: string;
  nome: string;
  categoria: "ATUAL" | "ANTIGA";
}

interface FotoAprovadaItem {
  id: string;
  url: string;
  descricao: string;
  destaque: boolean;
  topicoId: string | null;
}

function NovoTopicoForm({ onCriado }: { onCriado: () => void }): React.ReactElement {
  const [state, formAction, isPending] = useActionState(criarTopicoGaleriaAction, INITIAL_STATE);

  useEffect(() => {
    if (state !== INITIAL_STATE && state.sucesso) onCriado();
  }, [state, onCriado]);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 rounded-md bg-black/20 p-3">
      <div className="min-w-[180px] flex-1 space-y-1">
        <Label htmlFor="novo-topico-nome">Nome do tópico</Label>
        <Input id="novo-topico-nome" name="nome" required maxLength={150} placeholder="Ex: RBB 2026" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="novo-topico-categoria">Categoria</Label>
        <Select id="novo-topico-categoria" name="categoria" defaultValue="ATUAL" className="w-40">
          <option value="ATUAL">Atuais</option>
          <option value="ANTIGA">Das Antigas</option>
        </Select>
      </div>
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Criando..." : "Criar tópico"}
      </Button>
      {state.error ? <p className="w-full text-xs text-planalto-red">{state.error}</p> : null}
    </form>
  );
}

function DestaqueToggle({ foto }: { foto: FotoAprovadaItem }): React.ReactElement {
  const [state, formAction, isPending] = useActionState(marcarFotoDestaqueAction, INITIAL_STATE);

  return (
    <div className="relative">
      <Image
        src={foto.url}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 rounded-md object-cover object-top"
        unoptimized
      />
      <form action={formAction}>
        <input type="hidden" name="fotoId" value={foto.id} />
        <input type="hidden" name="destaque" value={(!foto.destaque).toString()} />
        <button
          type="submit"
          disabled={isPending}
          aria-label={foto.destaque ? "Remover destaque" : "Marcar como destaque"}
          className={cn(
            "absolute -right-1 -top-1 rounded-full p-1 shadow",
            foto.destaque ? "bg-planalto-red text-white" : "bg-black/70 text-planalto-gray",
          )}
        >
          <Star size={12} className={foto.destaque ? "fill-current" : ""} />
        </button>
      </form>
      {state.error ? (
        <p className="absolute left-0 top-full mt-1 w-40 text-[10px] text-planalto-red">{state.error}</p>
      ) : null}
    </div>
  );
}

function EditarFotoControl({
  foto,
  topicos,
}: {
  foto: FotoAprovadaItem;
  topicos: TopicoItem[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(atribuirTopicoFotoAction, INITIAL_STATE);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (state !== INITIAL_STATE && !state.error) setEditando(false);
  }, [state]);

  return (
    <div className="flex items-start gap-3 rounded-md bg-black/20 p-2">
      <Image
        src={foto.url}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-md object-cover object-top"
        unoptimized
      />

      {editando ? (
        <form action={formAction} className="flex-1 space-y-2">
          <input type="hidden" name="fotoId" value={foto.id} />
          <Select name="topicoId" required defaultValue={foto.topicoId ?? ""}>
            <option value="" disabled>
              Escolha um tópico
            </option>
            {topicos.map((topico) => (
              <option key={topico.id} value={topico.id}>
                {topico.nome} ({topico.categoria === "ATUAL" ? "Atuais" : "Das Antigas"})
              </option>
            ))}
          </Select>
          <Input name="descricao" defaultValue={foto.descricao} placeholder="Descrição (opcional)" maxLength={500} />
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
          {state.error ? <p className="text-xs text-planalto-red">{state.error}</p> : null}
        </form>
      ) : (
        <div className="flex-1">
          <p className="text-sm text-planalto-white">
            {topicos.find((t) => t.id === foto.topicoId)?.nome ?? "Sem tópico"}
          </p>
          <p className="text-xs text-planalto-gray">{foto.descricao || "Sem descrição"}</p>
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="mt-1 text-xs font-semibold text-planalto-white underline hover:text-planalto-red"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
}

export function GaleriaForm({
  topicos,
  fotosAprovadas,
}: {
  topicos: TopicoItem[];
  fotosAprovadas: FotoAprovadaItem[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(publicarFotoGaleriaAction, INITIAL_STATE);
  const [urls, setUrls] = useState<(string | undefined)[]>([undefined]);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [mostrarNovoTopico, setMostrarNovoTopico] = useState(topicos.length === 0);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);

  useEffect(() => {
    if (state !== INITIAL_STATE && state.sucesso) {
      setUrls([undefined]);
      setMostrarSucesso(true);
    }
  }, [state]);

  function adicionarSlot(): void {
    if (urls.length < MAX_FOTOS) setUrls((prev) => [...prev, undefined]);
  }

  function atualizarUrl(index: number, url: string): void {
    setMostrarSucesso(false);
    setUrls((prev) => prev.map((item, itemIndex) => (itemIndex === index ? url : item)));
  }

  const urlsPreenchidas = urls.filter(Boolean);
  const totalDestaques = fotosAprovadas.filter((foto) => foto.destaque).length;
  const topicosAtuais = topicos.filter((t) => t.categoria === "ATUAL");
  const topicosAntigos = topicos.filter((t) => t.categoria === "ANTIGA");

  const gruposDeEdicao = [
    ...topicos.map((topico) => ({
      chave: topico.id,
      titulo: `${topico.nome} (${topico.categoria === "ATUAL" ? "Atuais" : "Das Antigas"})`,
      fotos: fotosAprovadas.filter((foto) => foto.topicoId === topico.id),
    })),
    {
      chave: "sem-topico",
      titulo: "Sem tópico",
      fotos: fotosAprovadas.filter((foto) => !foto.topicoId),
    },
  ].filter((grupo) => grupo.fotos.length > 0);

  return (
    <Collapsible titulo="Galeria de Fotos" abertoPorPadrao>
      <p className="mb-3 text-xs text-planalto-gray">
        Organize as fotos em tópicos (álbuns) dentro de Atuais ou Das Antigas — fica mais fácil pra
        torcida entender. Fotos publicadas por aqui já aparecem direto na galeria pública.
      </p>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-planalto-white">Tópicos</p>
            <button
              type="button"
              onClick={() => setMostrarNovoTopico((prev) => !prev)}
              className="text-xs text-planalto-gray hover:text-planalto-white"
            >
              {mostrarNovoTopico ? "Cancelar" : "+ Novo tópico"}
            </button>
          </div>
          {mostrarNovoTopico ? (
            <NovoTopicoForm onCriado={() => setMostrarNovoTopico(false)} />
          ) : null}
        </div>

        {topicos.length === 0 ? (
          <p className="text-sm text-planalto-gray">Crie um tópico acima antes de publicar fotos.</p>
        ) : (
          <>
            {mostrarSucesso ? (
              <p className="text-sm font-semibold text-emerald-400">
                Foto(s) publicada(s) na galeria! 📸 Pode mandar mais quando quiser.
              </p>
            ) : null}

            <form action={formAction} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="topicoId">Publicar no tópico</Label>
                <Select id="topicoId" name="topicoId" required defaultValue="">
                  <option value="" disabled>
                    Selecione um tópico
                  </option>
                  {topicosAtuais.length > 0 ? (
                    <optgroup label="Atuais">
                      {topicosAtuais.map((topico) => (
                        <option key={topico.id} value={topico.id}>
                          {topico.nome}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {topicosAntigos.length > 0 ? (
                    <optgroup label="Das Antigas">
                      {topicosAntigos.map((topico) => (
                        <option key={topico.id} value={topico.id}>
                          {topico.nome}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </Select>
              </div>

              {urls.map((url, index) => (
                <div key={index}>
                  <ImageUpload
                    label={`Foto ${index + 1}`}
                    value={url}
                    onUploaded={(novaUrl) => atualizarUrl(index, novaUrl)}
                  />
                  {url ? <input type="hidden" name="fotoUrl" value={url} /> : null}
                </div>
              ))}

              {urls.length < MAX_FOTOS ? (
                <Button type="button" variant="ghost" onClick={adicionarSlot}>
                  + Adicionar outra foto
                </Button>
              ) : null}

              <div className="space-y-1">
                <Label htmlFor="descricao-galeria">Descrição (opcional)</Label>
                <Input id="descricao-galeria" name="descricao" maxLength={500} />
              </div>

              {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

              <Button type="submit" disabled={isPending || urlsPreenchidas.length === 0}>
                {isPending ? "Publicando..." : "Publicar na galeria"}
              </Button>
            </form>
          </>
        )}

        {fotosAprovadas.length > 0 ? (
          <div className="border-t border-white/10 pt-4">
            <p className="mb-2 text-sm font-semibold text-planalto-white">
              Fotos em destaque ({totalDestaques}/{MAX_DESTAQUES})
            </p>
            <p className="mb-2 text-xs text-planalto-gray">
              Clique na estrela pra escolher as {MAX_DESTAQUES} fotos que aparecem no topo da
              galeria pública.
            </p>
            <div className="flex flex-wrap items-start gap-3">
              {fotosAprovadas.map((foto) => (
                <DestaqueToggle key={foto.id} foto={foto} />
              ))}
            </div>
          </div>
        ) : null}

        {fotosAprovadas.length > 0 ? (
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setMostrarEdicao((prev) => !prev)}
              className="flex w-full items-center justify-between text-sm font-semibold text-planalto-white"
            >
              Editar fotos publicadas ({fotosAprovadas.length})
              <span className="text-xs font-normal text-planalto-gray">
                {mostrarEdicao ? "Ocultar" : "Mostrar"}
              </span>
            </button>

            {mostrarEdicao ? (
              <div className="mt-3 space-y-4">
                {gruposDeEdicao.map((grupo) => (
                  <div key={grupo.chave}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-planalto-gray">
                      {grupo.titulo} — {grupo.fotos.length} foto(s)
                    </p>
                    <div className="space-y-2">
                      {grupo.fotos.map((foto) => (
                        <EditarFotoControl key={foto.id} foto={foto} topicos={topicos} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Collapsible>
  );
}
