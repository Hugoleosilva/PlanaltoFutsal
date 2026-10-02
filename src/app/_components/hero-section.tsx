import Image from "next/image";

export function HeroSection(): React.ReactElement {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <Image
        src="/images/marca/capa-planalto-futsal.jpg"
        alt="Planalto Futsal"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-planalto-black to-transparent" />
    </section>
  );
}
