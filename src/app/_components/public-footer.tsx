import Image from "next/image";

export function PublicFooter(): React.ReactElement {
  return (
    <footer className="border-t border-white/10">
      <div className="relative h-28 w-full overflow-hidden sm:h-36">
        <Image
          src="/images/marca/banner-rodape-vermelho.png"
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="bg-planalto-black px-6 py-3 text-center text-sm text-planalto-gray">
        <p>Planalto Futsal — Jardim Planalto, Sancho, Recife-PE. @Copyright 2026</p>
      </div>
    </footer>
  );
}
