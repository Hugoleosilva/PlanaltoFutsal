"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { PasswordInput } from "@/shared/components/ui/password-input";

export function LoginForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/inicio";
  const verificacao = searchParams.get("verificacao");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos, ou e-mail ainda não confirmado.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm space-y-3 rounded-lg border border-surface/10 bg-card p-6 backdrop-blur-md"
    >
      <h1 className="font-heading text-2xl font-bold text-foreground">Entrar</h1>

      {verificacao === "ok" ? (
        <p className="rounded-md bg-emerald-900/40 px-3 py-2 text-sm text-emerald-300">
          E-mail confirmado! Já pode entrar.
        </p>
      ) : null}

      {verificacao === "invalida" ? (
        <p className="rounded-md bg-red-900/40 px-3 py-2 text-sm text-planalto-red">
          Link de verificação inválido ou expirado.
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Label htmlFor="email" className="w-16 shrink-0">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          required
          className="flex-1"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Label htmlFor="password" className="w-16 shrink-0">
            Senha
          </Label>
          <div className="flex-1">
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
        <div className="text-right">
          <Link href="/esqueci-senha" className="text-xs text-muted-foreground hover:text-foreground">
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-planalto-red">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <div className="space-y-3 pt-1">
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-semibold text-foreground underline decoration-planalto-red decoration-2 underline-offset-4 transition hover:text-planalto-red"
          >
            Cadastre-se
          </Link>
        </p>
        <p className="text-center">
          <Link href="/inicio" className="text-xs text-muted-foreground hover:text-foreground">
            Voltar ao início
          </Link>
        </p>
      </div>
    </form>
  );
}
