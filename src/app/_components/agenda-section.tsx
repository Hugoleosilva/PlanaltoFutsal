import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { Card } from "@/shared/components/ui/card";

function formatDataHora(data: Date): string {
  return data.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" });
}

export async function AgendaSection(): Promise<React.ReactElement> {
  const jogos = await new MongoJogoRepository().findProximos();

  return (
    <section id="agenda" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Agenda de Jogos
      </h2>

      {jogos.length === 0 ? (
        <p className="mt-6 text-center text-sm text-planalto-gray">
          Nenhum jogo agendado no momento.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {jogos.map((jogo) => (
            <Card key={jogo.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-planalto-white">Planalto Futsal x {jogo.adversario}</p>
                <p className="text-sm text-planalto-gray">{jogo.local}</p>
              </div>
              <p className="text-sm text-planalto-red">{formatDataHora(jogo.dataHora)}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
