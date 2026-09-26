import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { AtletaForm } from "./atleta-form";
import { AtletaCard } from "./atleta-card";
import { VincularUsuarioForm } from "./vincular-usuario-form";

export default async function ElencoPage(): Promise<React.ReactElement> {
  const atletaRepository = new MongoAtletaRepository();
  const [atletas, atletasSemAcesso] = await Promise.all([
    atletaRepository.findAllAtivos(),
    atletaRepository.findAllSemAcesso(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Elenco</h1>
        <p className="mt-1 text-planalto-gray">{atletas.length} atleta(s) ativo(s).</p>
      </div>

      <AtletaForm />

      <VincularUsuarioForm
        atletasSemAcesso={atletasSemAcesso.map((atleta) => ({ id: atleta.id, apelido: atleta.apelido }))}
      />

      {atletas.length === 0 ? (
        <p className="text-sm text-planalto-gray">Nenhum atleta cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {atletas.map((atleta) => (
            <AtletaCard
              key={atleta.id}
              id={atleta.id}
              nomeCompleto={atleta.nomeCompleto}
              apelido={atleta.apelido}
              idade={atleta.idade}
              posicao={atleta.posicao ?? null}
              fotoPrincipalUrl={atleta.fotoPrincipalUrl ?? null}
              temAcesso={Boolean(atleta.userId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
