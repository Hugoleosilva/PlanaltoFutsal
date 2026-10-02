"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/shared/utils/cn";

const LINKS = [
  { href: "/historia", label: "História" },
  { href: "/elenco", label: "Elenco" },
  { href: "/diretoria", label: "Diretoria" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeria", label: "Galeria" },
  { href: "/carona", label: "Carona" },
  { href: "/servicos", label: "Rede de Apoio" },
  { href: "/apoie", label: "Parceria" },
  { href: "/loja", label: "Loja" },
];

const DASHBOARD_POR_ROLE: Record<string, { href: string; label: string }> = {
  ADMIN: { href: "/admin", label: "Painel da Diretoria" },
  ATLETA: { href: "/atleta", label: "Meu Perfil" },
};

export function PublicNav(): React.ReactElement {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-planalto-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-x-auto px-6 py-3">
        <Link href="/inicio" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/marca/escudo-planalto-futsal.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-heading text-sm font-bold uppercase text-planalto-white">
            Planalto Futsal
          </span>
        </Link>

        <nav className="flex shrink-0 gap-4 text-sm text-planalto-gray">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap hover:text-planalto-white",
                pathname === link.href && "font-semibold text-planalto-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {status === "authenticated" && session.user ? (
            <>
              {(() => {
                const dashboard = DASHBOARD_POR_ROLE[session.user.role];
                return dashboard ? (
                  <Link
                    href={dashboard.href}
                    className="text-sm text-planalto-gray hover:text-planalto-white"
                  >
                    {dashboard.label}
                  </Link>
                ) : (
                  <span className="text-sm text-planalto-gray">Olá, {session.user.name}</span>
                );
              })()}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/inicio" })}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-planalto-red px-3 py-1.5 text-sm font-semibold text-white hover:bg-planalto-red-dark"
              >
                Fazer Login
              </Link>
              <Link
                href="/cadastro"
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
