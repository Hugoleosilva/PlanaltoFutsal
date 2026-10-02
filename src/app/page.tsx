import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GateSponsors } from "./_components/gate-sponsors";

export default function GatePage(): React.ReactElement {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden px-6 py-10 text-center">
      <Image
        src="/images/marca/capa-planalto-futsal.jpg"
        alt="Planalto Futsal"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <Link
        href="/inicio"
        className="absolute right-6 top-6 z-10 rounded-md bg-planalto-gray px-5 py-2.5 text-sm font-heading font-bold uppercase tracking-wide text-black transition hover:bg-white"
      >
        Entrar no Site
      </Link>

      <Suspense fallback={null}>
        <div className="relative z-10">
          <GateSponsors />
        </div>
      </Suspense>
    </main>
  );
}
