import Image from "next/image";
import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";

export async function GaleriaSection(): Promise<React.ReactElement> {
  const fotos = await new MongoFotoRepository().findByStatus("APROVADA");

  return (
    <section id="galeria" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Galeria de Fotos
      </h2>

      {fotos.length === 0 ? (
        <p className="mt-6 text-center text-sm text-planalto-gray">
          Em breve, fotos do time e da torcida por aqui.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative aspect-square overflow-hidden rounded-md">
              <Image src={foto.url} alt={foto.descricao ?? ""} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
