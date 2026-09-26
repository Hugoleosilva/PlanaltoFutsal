"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrarUsuarioAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const INITIAL_STATE: ActionState = { error: null, sucesso: false };

export function CadastroForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(registrarUsuarioAction, INITIAL_STATE);

  if (state.sucesso) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Quase lá!</h1>
        <p className="text-planalto-gray">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4 rounded-lg border border-white/10 bg-card p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Criar conta</h1>
        <p className="mt-1 text-sm text-planalto-gray">
          Torça, envie fotos, ofereça carona e acompanhe o Planalto Futsal.
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="nomeCompleto">Nome completo</Label>
        <Input id="nomeCompleto" name="nomeCompleto" required maxLength={150} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
        <Input id="whatsapp" name="whatsapp" placeholder="(81) 99999-9999" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" name="senha" type="password" required minLength={8} />
        <p className="text-xs text-planalto-gray">Mínimo 8 caracteres, com maiúscula, minúscula e número.</p>
      </div>

      {state.error ? <p className="text-sm text-planalto-red">{state.error}</p> : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-planalto-gray">
        Já tem conta?{" "}
        <Link href="/login" className="text-planalto-red underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
