import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { MongoCaronaSolidariaRepository } from "@/infrastructure/database/repositories/carona-solidaria.repository.mongo";
import { CaronaForm } from "./carona-form";
import { Card } from "@/shared/components/ui/card";

function formatDataHora(data: Date): string {
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Recife" });
}

export async function CaronaSection(): Promise<React.ReactElement> {
  const [jogos, caronas] = await Promise.all([
    new MongoJogoRepository().findProximos(),
    new MongoCaronaSolidariaRepository().findProximas(),
  ]);

  const jogoPorId = new Map(jogos.map((jogo) => [jogo.id, jogo]));

  return (
    <section id="carona" className="mx-auto w-full max-w-5xl px-6 py-3">
      <div className="mx-auto w-fit max-w-xl rounded-lg bg-card px-6 py-3 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">Carona Solidária</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ofereça ou encontre uma carona para o próximo Jogo.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
        <div className="h-full">
          {jogos.length > 0 ? (
            <CaronaForm jogos={jogos.map((jogo) => ({ id: jogo.id, adversario: jogo.adversario }))} />
          ) : null}
        </div>

        <Card className="flex h-full flex-col p-5">
          {caronas.length > 0 ? (
            <div className="space-y-3">
              {caronas.map((carona) => {
                const jogo = jogoPorId.get(carona.jogoId);
                return (
                  <div key={carona.id} className="rounded-md bg-black/20 p-3">
                    <p className="font-semibold text-foreground">
                      {jogo ? `Planalto Futsal x ${jogo.adversario}` : "Jogo"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saída: {formatDataHora(carona.horarioSaida)} · {carona.local}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Motorista: {carona.motoristaNome} · {carona.contato} ·{" "}
                      {carona.vagasDisponiveis} vaga(s)
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="m-auto text-center text-sm text-muted-foreground">
              Nenhuma carona oferecida ainda.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}
