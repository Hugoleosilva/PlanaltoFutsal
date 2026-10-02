"use client";

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
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

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

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-card">
      <div className="flex items-center gap-3 px-5 py-5">
        <Image
          src="/images/marca/escudo-planalto-futsal.png"
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
        <p className="font-heading text-sm font-bold uppercase text-planalto-white">
          Planalto Futsal
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-planalto-red text-white"
                  : "text-planalto-gray hover:bg-white/5 hover:text-planalto-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <p className="px-3 pb-1 pt-4 text-xs uppercase tracking-wide text-planalto-gray">
          Ir Para
        </p>
        {LINKS_SITE.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-planalto-gray transition hover:bg-white/5 hover:text-planalto-white"
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/inicio" })}
        className="flex items-center gap-3 border-t border-white/10 px-5 py-4 text-sm text-planalto-gray transition hover:text-planalto-white"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
