import Image from "next/image";
import Link from "next/link";

export default function HomePage(): React.ReactElement {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Image
        src="/images/marca/capa-planalto-futsal.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-30"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/images/marca/escudo-planalto-futsal.png"
          alt="Escudo do Planalto Futsal"
          width={160}
          height={160}
          priority
        />

        <h1 className="font-heading text-4xl font-bold uppercase tracking-wide text-planalto-white sm:text-5xl">
          Planalto Futsal
        </h1>
        <p className="max-w-xl text-planalto-gray">
          Equipe de futebol e futsal de várzea do Jardim Planalto, Sancho — Zona Oeste do Recife-PE.
          União, garra, respeito e fé.
        </p>

        <Link
          href="/login"
          className="rounded-md bg-planalto-red px-6 py-3 font-semibold text-white transition hover:bg-planalto-red-dark"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
