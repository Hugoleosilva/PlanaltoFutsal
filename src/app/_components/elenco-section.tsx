import Image from "next/image";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { MongoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { Badge } from "@/shared/components/ui/badge";

const POSICAO_LABEL: Record<string, string> = {
  GOLEIRO: "Goleiro",
  FIXO: "Fixo",
  ALA: "Ala",
  PIVO: "Pivô",
  LINHA: "Linha",
};

export async function ElencoSection(): Promise<React.ReactElement> {
  const [atletas, campeonatos] = await Promise.all([
    new MongoAtletaRepository().findAllAtivos(),
    new MongoCampeonatoRepository().findAll(),
  ]);

  const campeonatosAtivos = campeonatos.filter((campeonato) => campeonato.status !== "ENCERRADO");

  return (
    <section id="elenco" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">Nosso Elenco</h2>

      {campeonatosAtivos.length > 0 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {campeonatosAtivos.map((campeonato) => (
            <Badge key={campeonato.id}>{campeonato.nome}</Badge>
          ))}
        </div>
      ) : null}

      {atletas.length === 0 ? (
        <p className="mt-8 text-center text-sm text-planalto-gray">Elenco em atualização.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {atletas.map((atleta) => (
            <div key={atleta.id} className="flex flex-col items-center text-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white/10">
                {atleta.fotoPrincipalUrl ? (
                  <Image src={atleta.fotoPrincipalUrl} alt="" fill className="object-cover" unoptimized />
                ) : null}
              </div>
              <p className="mt-2 text-sm font-medium text-planalto-white">{atleta.apelido}</p>
              {atleta.posicao ? (
                <p className="text-xs text-planalto-gray">{POSICAO_LABEL[atleta.posicao]}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
