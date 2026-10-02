import { MongoPatrocinadorRepository } from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import Image from "next/image";
import { MarqueeCarousel } from "@/shared/components/ui/marquee-carousel";

export async function GateSponsors(): Promise<React.ReactElement> {
  const patrocinadores = await new MongoPatrocinadorRepository().findAllAtivos();

  if (patrocinadores.length === 0) return <></>;

  return (
    <div className="w-screen">
      <MarqueeCarousel>
        {patrocinadores.map((patrocinador) => (
          <div key={patrocinador.id} className="mx-6 shrink-0">
            <Image
              src={patrocinador.logoUrl}
              alt={patrocinador.nome}
              width={72}
              height={48}
              style={{ height: `${48 * (patrocinador.escala / 100)}px` }}
              className="w-auto object-contain opacity-90"
              unoptimized
            />
          </div>
        ))}
      </MarqueeCarousel>
    </div>
  );
}
