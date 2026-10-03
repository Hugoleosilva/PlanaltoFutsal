import Image from "next/image";
import { MongoPatrocinadorRepository } from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import { MarqueeCarousel } from "@/shared/components/ui/marquee-carousel";

export async function PatrocinadoresSection(): Promise<React.ReactElement> {
  const patrocinadores = await new MongoPatrocinadorRepository().findAllAtivos();

  if (patrocinadores.length === 0) return <></>;

  return (
    <section id="patrocinadores" className="bg-background pt-6 pb-0">
      <h2 className="mx-auto max-w-6xl px-6 text-center font-heading text-3xl font-bold text-muted-foreground">
        Empresas Parceiras que Acreditam na Gente e Fortalecem Nossa Comunidade
      </h2>

      <div className="mt-6">
        <MarqueeCarousel>
          {patrocinadores.map((patrocinador) => {
            const logo = (
              <Image
                src={patrocinador.logoUrl}
                alt={patrocinador.nome}
                width={110}
                height={70}
                style={{ height: `${56 * (patrocinador.escala / 100)}px` }}
                className="w-auto object-contain"
                unoptimized
              />
            );

            return (
              <div key={patrocinador.id} className="mx-6 shrink-0">
                {patrocinador.link ? (
                  <a href={patrocinador.link} target="_blank" rel="noopener noreferrer">
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </div>
            );
          })}
        </MarqueeCarousel>
      </div>
    </section>
  );
}
