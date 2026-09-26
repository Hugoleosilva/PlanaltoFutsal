"use client";

import { useActionState, useState } from "react";
import { cadastrarPatrocinadorAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";
import { ImageUpload } from "@/shared/components/image-upload";

const INITIAL_STATE: ActionState = { error: null };

export function PatrocinadorForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(cadastrarPatrocinadorAction, INITIAL_STATE);
  const [logoUrl, setLogoUrl] = useState<string | undefined>();

  return (
    <Card>
      <h2 className="font-heading text-lg font-bold text-planalto-white">Patrocinador</h2>

      <form action={formAction} className="mt-4 space-y-3">
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

        {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}
        {!logoUrl ? <p className="text-xs text-planalto-gray">Envie a logo antes de salvar.</p> : null}

        <Button type="submit" disabled={isPending || !logoUrl}>
          {isPending ? "Salvando..." : "Adicionar patrocinador"}
        </Button>
      </form>
    </Card>
  );
}
