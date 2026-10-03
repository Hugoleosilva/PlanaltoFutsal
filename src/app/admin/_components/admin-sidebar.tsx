"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Wallet,
  Users,
  Trophy,
  ImageIcon,
  LogOut,
  CalendarDays,
  Megaphone,
  Briefcase,
  Home,
  HeartHandshake,
  UserCog,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ThemeToggle } from "../../_components/theme-toggle";

const NAV_ITEMS = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/admin/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/admin/elenco", label: "Elenco", icon: Users },
  { href: "/admin/diretoria", label: "Diretoria", icon: UserCog },
  { href: "/admin/socios", label: "Sócios", icon: HeartHandshake },
  { href: "/admin/campeonatos", label: "Campeonatos", icon: Trophy },
  { href: "/admin/jogos", label: "Jogos", icon: CalendarDays },
  { href: "/admin/moderacao", label: "Moderação de Fotos", icon: ImageIcon },
  { href: "/admin/servicos", label: "Moderação de Serviços", icon: Briefcase },
  { href: "/admin/conteudo", label: "Conteúdo do Site", icon: Megaphone },
];

const LINKS_SITE = [
  { href: "/elenco", label: "Atletas", icon: Users },
  { href: "/inicio", label: "Página Principal", icon: Home },
] as const;

export function AdminSidebar(): React.ReactElement {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-surface/10 bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/images/marca/escudo-planalto-futsal.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
          <p className="font-heading text-sm font-bold uppercase text-foreground">
            Planalto Futsal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            className="text-foreground"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {aberto ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setAberto(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-surface/10 bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          aberto ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/images/marca/escudo-planalto-futsal.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
            <p className="font-heading text-sm font-bold uppercase text-foreground">
              Planalto Futsal
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
            className="text-muted-foreground lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setAberto(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-planalto-red text-white"
                    : "text-muted-foreground hover:bg-surface/5 hover:text-foreground",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}

          <p className="px-3 pb-1 pt-4 text-xs uppercase tracking-wide text-muted-foreground">
            Ir Para
          </p>
          {LINKS_SITE.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setAberto(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-surface/5 hover:text-foreground"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-3 border-t border-surface/10 px-5 py-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/inicio" })}
            className="flex items-center gap-3 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <LogOut size={18} />
            Sair
          </button>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
