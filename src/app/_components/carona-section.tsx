import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { MongoCaronaSolidariaRepository } from "@/infrastructure/database/repositories/carona-solidaria.repository.mongo";
import { CaronaForm } from "./carona-form";
import { Card } from "@/shared/components/ui/card";

function formatDataHora(data: Date): string {
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export async function CaronaSection(): Promise<React.ReactElement> {
  const [jogos, caronas] = await Promise.all([
    new MongoJogoRepository().findProximos(),
    new MongoCaronaSolidariaRepository().findProximas(),
  ]);

  const jogoPorId = new Map(jogos.map((jogo) => [jogo.id, jogo]));

  return (
    <section id="carona" className="mx-auto max-w-5xl px-6 py-8">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Carona Solidária
      </h2>
      <p className="mt-2 text-center text-planalto-gray">
        Ofereça ou encontre uma carona para o próximo jogo.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          {caronas.length > 0 ? (
            <div className="space-y-3">
              {caronas.map((carona) => {
                const jogo = jogoPorId.get(carona.jogoId);
                return (
                  <Card key={carona.id}>
                    <p className="font-semibold text-planalto-white">
                      {jogo ? `Planalto Futsal x ${jogo.adversario}` : "Jogo"}
                    </p>
                    <p className="text-sm text-planalto-gray">
                      Saída: {formatDataHora(carona.horarioSaida)} · {carona.local}
                    </p>
                    <p className="text-sm text-planalto-gray">
                      Motorista: {carona.motoristaNome} · {carona.contato} ·{" "}
                      {carona.vagasDisponiveis} vaga(s)
                    </p>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-planalto-gray">Nenhuma carona oferecida ainda.</p>
          )}
        </div>

        <div>
          {jogos.length > 0 ? (
            <CaronaForm jogos={jogos.map((jogo) => ({ id: jogo.id, adversario: jogo.adversario }))} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
