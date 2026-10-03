import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { MongoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { JogoForm } from "./jogo-form";
import { JogoRow } from "./jogo-row";

export default async function JogosPage(): Promise<React.ReactElement> {
  const [jogos, campeonatos] = await Promise.all([
    new MongoJogoRepository().findAll(),
    new MongoCampeonatoRepository().findAll(),
  ]);

  const nomeCampeonatoPorId = new Map(campeonatos.map((campeonato) => [campeonato.id, campeonato.nome]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Jogos</h1>
        <p className="mt-1 text-muted-foreground">Agenda exibida no Portal Público.</p>
      </div>

      <JogoForm campeonatos={campeonatos.map((c) => ({ id: c.id, nome: c.nome }))} />

      <Card>
        <h2 className="font-heading text-lg font-bold text-foreground">Todos os jogos</h2>

        {jogos.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhum jogo cadastrado ainda.</p>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {jogos.map((jogo) => (
              <JogoRow
                key={jogo.id}
                jogo={{
                  id: jogo.id,
                  adversario: jogo.adversario,
                  adversarioEscudoUrl: jogo.adversarioEscudoUrl ?? null,
                  dataHora: jogo.dataHora,
                  local: jogo.local,
                  campeonatoId: jogo.campeonatoId ?? null,
                  status: jogo.status,
                  placarPlanalto: jogo.placarPlanalto ?? null,
                  placarAdversario: jogo.placarAdversario ?? null,
                  mandante: jogo.mandante,
                }}
                campeonatos={campeonatos.map((c) => ({ id: c.id, nome: c.nome }))}
                nomeCampeonato={
                  jogo.campeonatoId ? (nomeCampeonatoPorId.get(jogo.campeonatoId) ?? "Campeonato") : "Amistoso"
                }
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
