"use client";

import { useActionState } from "react";
import { publicarComunicadoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";

const INITIAL_STATE: ActionState = { error: null };

export function ComunicadoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(publicarComunicadoAction, INITIAL_STATE);

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Mural de avisos</h2>

      <form action={formAction} className="mt-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" name="titulo" required maxLength={200} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tipo">Tipo</Label>
            <Select id="tipo" name="tipo" defaultValue="AVISO">
              <option value="AVISO">Aviso</option>
              <option value="NOTICIA">Notícia</option>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="corpo">Texto</Label>
          <Textarea id="corpo" name="corpo" rows={3} required />
        </div>

        <label className="flex items-center gap-2 text-sm text-planalto-gray">
          <input type="checkbox" name="fixado" className="accent-planalto-red" />
          Fixar no topo do mural
        </label>

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Publicando..." : "Publicar"}
        </Button>
      </form>
    </Card>
  );
}
