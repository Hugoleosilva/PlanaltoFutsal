"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Home, LogOut } from "lucide-react";

export function AtletaTopbar(): React.ReactElement {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <Image
          src="/images/marca/escudo-planalto-futsal.png"
          alt=""
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-heading text-sm font-bold uppercase text-planalto-white">
          Planalto Futsal
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/inicio"
          className="flex items-center gap-2 text-sm text-planalto-gray transition hover:text-planalto-white"
        >
          <Home size={16} />
          Início
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/inicio" })}
          className="flex items-center gap-2 text-sm text-planalto-gray transition hover:text-planalto-white"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </header>
  );
}
