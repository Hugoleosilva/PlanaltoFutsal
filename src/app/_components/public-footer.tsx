import Image from "next/image";

export function PublicFooter(): React.ReactElement {
  return (
    <footer className="border-t border-surface/10">
      <div className="relative h-28 w-full overflow-hidden sm:h-36">
        <Image
          src="/images/marca/banner-rodape-quadra-vermelha.png"
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="bg-background px-6 py-3 text-center text-sm text-muted-foreground">
        <p>Planalto Futsal — Jardim Planalto, Sancho, Recife-PE. @Copyright 2026</p>
      </div>
    </footer>
  );
}
