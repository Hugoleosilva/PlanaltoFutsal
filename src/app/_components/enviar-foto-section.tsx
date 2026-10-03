"use client";

import { useActionState, useState } from "react";
import { enviarFotosTorcedorAction, type ActionState } from "../actions";
import { ImageUpload } from "@/shared/components/image-upload";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };
const MAX_FOTOS = 5;

export function EnviarFotoSection({ semTitulo = false }: { semTitulo?: boolean } = {}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(enviarFotosTorcedorAction, INITIAL_STATE);
  const [urls, setUrls] = useState<(string | undefined)[]>([undefined]);

  function adicionarSlot(): void {
    if (urls.length < MAX_FOTOS) setUrls((prev) => [...prev, undefined]);
  }

  function atualizarUrl(index: number, url: string): void {
    setUrls((prev) => prev.map((item, itemIndex) => (itemIndex === index ? url : item)));
  }

  return (
    <section id="enviar-fotos" className={semTitulo ? "" : "mx-auto max-w-2xl px-6 py-16"}>
      {!semTitulo ? (
        <>
          <h2 className="text-center font-heading text-3xl font-bold text-foreground">
            Envie suas Fotos
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Fotos Antigas ou Atuais do Time, Torcida ou Comunidade — até {MAX_FOTOS} por envio. Ficam
            pendentes até a Diretoria Aprovar.
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Fotos Antigas ou Atuais do Time, Torcida ou Comunidade — até {MAX_FOTOS} por envio. Ficam Pendentes
          até a Diretoria Aprovar.
        </p>
      )}

      {state.sucesso ? (
        <Card className="mt-8 text-center">
          <p className="text-foreground">Fotos Enviadas! Valeu aí pela Contribuição 🙌</p>
        </Card>
      ) : (
        <Card className="mt-8">
          <form action={formAction} className="space-y-4">
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
              <Label htmlFor="categoria">Categoria</Label>
              <Select id="categoria" name="categoria" defaultValue="ATUAL">
                <option value="ATUAL">Foto atual</option>
                <option value="ANTIGA">Foto antiga</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Input id="descricao" name="descricao" maxLength={500} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="enviadoPorNome">Seu nome (opcional)</Label>
              <Input id="enviadoPorNome" name="enviadoPorNome" />
            </div>

            {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

            <Button type="submit" disabled={isPending || !urls.some(Boolean)} className="w-full">
              {isPending ? "Enviando..." : "Enviar fotos"}
            </Button>
          </form>
        </Card>
      )}
    </section>
  );
}
