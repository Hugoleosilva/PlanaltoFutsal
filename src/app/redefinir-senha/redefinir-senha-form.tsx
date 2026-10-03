"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { redefinirSenhaAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { PasswordInput } from "@/shared/components/ui/password-input";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };

export function RedefinirSenhaForm(): React.ReactElement {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, isPending] = useActionState(redefinirSenhaAction, INITIAL_STATE);

  if (!token) {
    return (
      <div className="space-y-3 rounded-lg border border-surface/10 bg-black/30 p-6 text-center backdrop-blur-md">
        <h1 className="font-heading text-2xl font-bold text-foreground">Link inválido</h1>
        <p className="text-muted-foreground">
          Esse link de redefinição está incompleto. Peça um novo na tela de login.
        </p>
        <Link href="/esqueci-senha" className="inline-block text-sm text-planalto-red underline">
          Pedir novo link
        </Link>
      </div>
    );
  }

  if (state.sucesso) {
    return (
      <div className="space-y-3 rounded-lg border border-surface/10 bg-black/30 p-6 text-center backdrop-blur-md">
        <h1 className="font-heading text-2xl font-bold text-foreground">Senha redefinida!</h1>
        <p className="text-muted-foreground">Já pode entrar com a nova senha.</p>
        <Link href="/login" className="inline-block text-sm text-planalto-red underline">
          Ir pro login
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-sm space-y-3 rounded-lg border border-surface/10 bg-black/30 p-6 backdrop-blur-md"
    >
      <input type="hidden" name="token" value={token} />

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Nova senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">Escolha uma nova senha pra sua conta.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="novaSenha">Nova senha</Label>
        <PasswordInput id="novaSenha" name="novaSenha" required minLength={8} />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, com maiúscula, minúscula e número.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
        <PasswordInput id="confirmarSenha" name="confirmarSenha" required minLength={8} />
      </div>

      {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
