import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "#historia", label: "História" },
  { href: "#elenco", label: "Elenco" },
  { href: "#agenda", label: "Agenda" },
  { href: "#galeria", label: "Galeria" },
  { href: "#carona", label: "Carona" },
  { href: "#apoie", label: "Apoie" },
  { href: "#loja", label: "Loja" },
];

export function PublicNav(): React.ReactElement {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-planalto-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-x-auto px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/marca/escudo-planalto-futsal.jpg"
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
            <a key={link.href} href={link.href} className="whitespace-nowrap hover:text-planalto-white">
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="shrink-0 rounded-md bg-planalto-red px-3 py-1.5 text-sm font-semibold text-white hover:bg-planalto-red-dark"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
