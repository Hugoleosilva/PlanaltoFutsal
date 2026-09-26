import Image from "next/image";
import { MongoPatrocinadorRepository } from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";

export async function PatrocinadoresSection(): Promise<React.ReactElement> {
  const patrocinadores = await new MongoPatrocinadorRepository().findAllAtivos();

  if (patrocinadores.length === 0) return <></>;

  return (
    <section id="patrocinadores" className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Patrocinadores & Apoiadores
      </h2>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
        {patrocinadores.map((patrocinador) => {
          const logo = (
            <Image
              src={patrocinador.logoUrl}
              alt={patrocinador.nome}
              width={120}
              height={80}
              className="object-contain"
              unoptimized
            />
          );

          return (
            <div key={patrocinador.id} className="flex flex-col items-center gap-2 text-center">
              {patrocinador.link ? (
                <a href={patrocinador.link} target="_blank" rel="noopener noreferrer">
                  {logo}
                </a>
              ) : (
                logo
              )}
              {patrocinador.depoimento ? (
                <p className="max-w-[200px] text-xs text-planalto-gray">
                  &ldquo;{patrocinador.depoimento}&rdquo;
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
