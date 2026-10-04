"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrarUsuarioAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TelefoneInput } from "@/shared/components/ui/telefone-input";
import { Label } from "@/shared/components/ui/label";
import { PasswordInput } from "@/shared/components/ui/password-input";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };

export function CadastroForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(registrarUsuarioAction, INITIAL_STATE);

  if (state.sucesso) {
    return (
      <div className="space-y-3 rounded-lg border border-surface/10 bg-card p-6 text-center backdrop-blur-md">
        <h1 className="font-heading text-2xl font-bold text-foreground">Quase lá!</h1>
        <p className="text-muted-foreground">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta.
        </p>
        <Link href="/inicio" className="inline-block text-sm text-planalto-red underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-sm space-y-3 rounded-lg border border-surface/10 bg-card p-6 backdrop-blur-md"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Criar conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Torça, envie fotos, ofereça carona e acompanhe o Planalto Futsal.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Label htmlFor="nomeCompleto" className="w-24 shrink-0">
          Nome
        </Label>
        <Input id="nomeCompleto" name="nomeCompleto" required maxLength={150} className="flex-1" />
      </div>

      <div className="flex items-center gap-3">
        <Label htmlFor="email" className="w-24 shrink-0">
          E-mail
        </Label>
        <Input id="email" name="email" type="email" required className="flex-1" />
      </div>

      <div className="flex items-center gap-3">
        <Label htmlFor="whatsapp" className="w-24 shrink-0">
          WhatsApp
        </Label>
        <TelefoneInput id="whatsapp" name="whatsapp" className="flex-1" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Label htmlFor="senha" className="w-24 shrink-0">
            Senha
          </Label>
          <div className="flex-1">
            <PasswordInput id="senha" name="senha" required minLength={8} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, com maiúscula, minúscula e número.</p>
      </div>

      {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Criando conta..." : "Criar conta"}
      </Button>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <Link href="/inicio" className="hover:text-foreground">
          Voltar ao início
        </Link>
        <Link
          href="/login"
          className="font-semibold text-foreground underline decoration-planalto-red decoration-2 underline-offset-4 transition hover:text-planalto-red"
        >
          Entrar
        </Link>
      </div>
    </form>
  );
}
