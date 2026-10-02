import Image from "next/image";

export function HeroFaixa(): React.ReactElement {
  return (
    <div className="relative h-20 w-full overflow-hidden sm:h-28">
      <Image
        src="/images/marca/planalto_quadra.png"
        alt=""
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-planalto-black" />
    </div>
  );
}
