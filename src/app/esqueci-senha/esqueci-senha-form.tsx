"use client";

import { useActionState } from "react";
import Link from "next/link";
import { solicitarRedefinicaoSenhaAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };

export function EsqueciSenhaForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(solicitarRedefinicaoSenhaAction, INITIAL_STATE);

  if (state.sucesso) {
    return (
      <div className="space-y-3 rounded-lg border border-white/10 bg-black/30 p-6 text-center backdrop-blur-md">
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Confira seu e-mail</h1>
        <p className="text-planalto-gray">
          Se existir uma conta com esse e-mail, enviamos um link pra redefinir a senha. Ele vale por 1
          hora.
        </p>
        <Link href="/login" className="inline-block text-sm text-planalto-red underline">
          Voltar pro login
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="w-full max-w-sm space-y-3 rounded-lg border border-white/10 bg-black/30 p-6 backdrop-blur-md"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Esqueceu a senha?</h1>
        <p className="mt-1 text-sm text-planalto-gray">
          Digite seu e-mail e mandamos um link pra você escolher uma nova senha.
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enviando..." : "Enviar link"}
      </Button>

      <p className="text-center text-sm text-planalto-gray">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-planalto-red underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
