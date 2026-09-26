import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";
import { FotoCard } from "./foto-card";

export default async function ModeracaoPage(): Promise<React.ReactElement> {
  const fotos = await new MongoFotoRepository().findByStatus("PENDENTE_APROVACAO");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Moderação de Fotos</h1>
        <p className="mt-1 text-planalto-gray">
          {fotos.length} foto(s) aguardando aprovação.
        </p>
      </div>

      {fotos.length === 0 ? (
        <p className="text-sm text-planalto-gray">Nenhuma foto pendente no momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fotos.map((foto) => (
            <FotoCard
              key={foto.id}
              id={foto.id}
              url={foto.url}
              descricao={foto.descricao}
              categoria={foto.categoria}
              enviadoPorNome={foto.enviadoPorNome}
            />
          ))}
        </div>
      )}
    </div>
  );
}
