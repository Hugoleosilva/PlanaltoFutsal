import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { ServicoCard } from "./servico-card";

export default async function ServicosModeracaoPage(): Promise<React.ReactElement> {
  const servicos = await new MongoServicoRepository().findByStatus("PENDENTE_APROVACAO");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">
          Moderação de Serviços
        </h1>
        <p className="mt-1 text-planalto-gray">
          {servicos.length} serviço(s) aguardando aprovação.
        </p>
      </div>

      {servicos.length === 0 ? (
        <p className="text-sm text-planalto-gray">Nenhum serviço pendente no momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico) => (
            <ServicoCard
              key={servico.id}
              id={servico.id}
              titulo={servico.titulo}
              descricao={servico.descricao}
              imagensUrls={[...servico.imagensUrls]}
              valores={servico.valores}
              formasPagamento={[...servico.formasPagamento]}
              categoria={servico.categoria}
              bairro={servico.bairro}
              nomeContato={servico.nomeContato}
              contato={servico.contato}
            />
          ))}
        </div>
      )}
    </div>
  );
}
