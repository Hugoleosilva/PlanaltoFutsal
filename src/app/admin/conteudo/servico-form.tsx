"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { publicarServicoDiretoriaAction, editarServicoAction, type ActionState } from "./actions";
import { ImageUpload } from "@/shared/components/image-upload";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TelefoneInput } from "@/shared/components/ui/telefone-input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/select";
import { Collapsible } from "@/shared/components/ui/collapsible";
import { CATEGORIAS_SERVICO, CATEGORIA_SERVICO_LABEL } from "@/shared/constants/categorias-servico";

const INITIAL_STATE: ActionState = { error: null };
const MAX_IMAGENS = 2;

const FORMAS_PAGAMENTO = [
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "Pix" },
  { value: "CARTAO", label: "Cartão" },
];

interface ServicoAprovadoItem {
  id: string;
  titulo: string;
  descricao: string;
  imagensUrls: string[];
  valores?: string;
  formasPagamento: string[];
  categoria: string;
  bairro: string;
  nomeContato: string;
  contato: string;
}

function EditarServicoControl({ servico }: { servico: ServicoAprovadoItem }): React.ReactElement {
  const [state, formAction, isPending] = useActionState(editarServicoAction, INITIAL_STATE);
  const [editando, setEditando] = useState(false);
  const [imagens, setImagens] = useState<(string | undefined)[]>(servico.imagensUrls);

  useEffect(() => {
    if (state !== INITIAL_STATE && state.sucesso) setEditando(false);
  }, [state]);

  function adicionarSlot(): void {
    if (imagens.length < MAX_IMAGENS) setImagens((prev) => [...prev, undefined]);
  }

  function atualizarImagem(index: number, url: string): void {
    setImagens((prev) => prev.map((item, itemIndex) => (itemIndex === index ? url : item)));
  }

  if (!editando) {
    return (
      <div className="flex items-start gap-3 rounded-md bg-black/20 p-2">
        {servico.imagensUrls[0] ? (
          <Image
            src={servico.imagensUrls[0]}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-md object-cover object-top"
            unoptimized
          />
        ) : null}
        <div className="flex-1">
          <p className="text-sm text-foreground">{servico.titulo}</p>
          <p className="text-xs text-muted-foreground">
            {servico.nomeContato} · {servico.contato}
          </p>
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="mt-1 text-xs font-semibold text-foreground underline hover:text-planalto-red"
          >
            Editar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-md bg-black/20 p-3">
      <input type="hidden" name="servicoId" value={servico.id} />

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
        <Label>Título do serviço</Label>
        <Input name="titulo" required maxLength={150} defaultValue={servico.titulo} />
      </div>

      <div className="space-y-1">
        <Label>Descrição</Label>
        <Textarea name="descricao" rows={3} required maxLength={1000} defaultValue={servico.descricao} />
      </div>

      <div className="space-y-1">
        <Label>Valores (opcional)</Label>
        <Input name="valores" defaultValue={servico.valores} />
      </div>

      <div className="space-y-1">
        <Label>Categoria</Label>
        <Select name="categoria" required defaultValue={servico.categoria}>
          {CATEGORIAS_SERVICO.map((categoria) => (
            <option key={categoria} value={categoria}>
              {CATEGORIA_SERVICO_LABEL[categoria]}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Bairro</Label>
        <Input name="bairro" required maxLength={100} defaultValue={servico.bairro} />
      </div>

      <div className="space-y-1">
        <Label>Formas de pagamento</Label>
        <div className="flex flex-wrap gap-4">
          {FORMAS_PAGAMENTO.map((forma) => (
            <label key={forma.value} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="formasPagamento"
                value={forma.value}
                defaultChecked={servico.formasPagamento.includes(forma.value)}
                className="accent-planalto-red"
              />
              {forma.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Nome do prestador</Label>
        <Input name="nomeContato" required maxLength={150} defaultValue={servico.nomeContato} />
      </div>

      <div className="space-y-1">
        <Label>Contato (WhatsApp)</Label>
        <TelefoneInput name="contato" required defaultValue={servico.contato} />
      </div>

      {state.error ? <p className="text-xs text-planalto-red">{state.error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setEditando(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export function ServicoForm({
  servicosAprovados,
}: {
  servicosAprovados: ServicoAprovadoItem[];
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(publicarServicoDiretoriaAction, INITIAL_STATE);
  const [imagens, setImagens] = useState<(string | undefined)[]>([undefined]);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);

  useEffect(() => {
    if (state !== INITIAL_STATE && state.sucesso) {
      setImagens([undefined]);
      setMostrarSucesso(true);
    }
  }, [state]);

  function adicionarSlot(): void {
    if (imagens.length < MAX_IMAGENS) setImagens((prev) => [...prev, undefined]);
  }

  function atualizarImagem(index: number, url: string): void {
    setMostrarSucesso(false);
    setImagens((prev) => prev.map((item, itemIndex) => (itemIndex === index ? url : item)));
  }

  const imagensPreenchidas = imagens.filter(Boolean);

  return (
    <Collapsible titulo="Serviços">
      <p className="mb-3 text-xs text-muted-foreground">
        Publique um serviço direto por aqui — já sai aprovado na página pública, sem passar pela
        fila de moderação.
      </p>

      {mostrarSucesso ? (
        <p className="mb-3 text-sm font-semibold text-emerald-400">
          Serviço publicado! Já aparece na página pública. 🛠️
        </p>
      ) : null}

      <form action={formAction} className="space-y-3">
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
          <Label htmlFor="servico-titulo">Título do serviço</Label>
          <Input
            id="servico-titulo"
            name="titulo"
            required
            maxLength={150}
            placeholder="Ex: Corte de cabelo a domicílio"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="servico-descricao">Descrição</Label>
          <Textarea id="servico-descricao" name="descricao" rows={3} required maxLength={1000} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="servico-valores">Valores (opcional)</Label>
          <Input id="servico-valores" name="valores" placeholder="Ex: A partir de R$ 25" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="servico-categoria">Categoria</Label>
          <Select id="servico-categoria" name="categoria" required defaultValue="">
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {CATEGORIAS_SERVICO.map((categoria) => (
              <option key={categoria} value={categoria}>
                {CATEGORIA_SERVICO_LABEL[categoria]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="servico-bairro">Bairro</Label>
          <Input id="servico-bairro" name="bairro" required maxLength={100} placeholder="Ex: Jardim Planalto" />
        </div>

        <div className="space-y-1">
          <Label>Formas de pagamento</Label>
          <div className="flex flex-wrap gap-4">
            {FORMAS_PAGAMENTO.map((forma) => (
              <label key={forma.value} className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <Label htmlFor="servico-nomeContato">Nome do prestador</Label>
          <Input id="servico-nomeContato" name="nomeContato" required maxLength={150} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="servico-contato">Contato (WhatsApp)</Label>
          <TelefoneInput id="servico-contato" name="contato" required />
        </div>

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

        <Button type="submit" disabled={isPending || imagensPreenchidas.length === 0}>
          {isPending ? "Publicando..." : "Publicar serviço"}
        </Button>
      </form>

      {servicosAprovados.length > 0 ? (
        <div className="mt-4 border-t border-surface/10 pt-4">
          <button
            type="button"
            onClick={() => setMostrarEdicao((prev) => !prev)}
            className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
          >
            Editar serviços publicados ({servicosAprovados.length})
            <span className="text-xs font-normal text-muted-foreground">
              {mostrarEdicao ? "Ocultar" : "Mostrar"}
            </span>
          </button>

          {mostrarEdicao ? (
            <div className="mt-3 space-y-2">
              {servicosAprovados.map((servico) => (
                <EditarServicoControl key={servico.id} servico={servico} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </Collapsible>
  );
}
