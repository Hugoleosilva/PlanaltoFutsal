import Link from "next/link";
import { Car } from "lucide-react";
import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { ConfrontoEscudos } from "./confronto-escudos";
import { tituloConfronto } from "./confronto-texto";

function formatDataHora(data?: Date | null): string {
  if (!data) return "Data e Hora ainda não definidas!";
  return data.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Recife" });
}

export async function AgendaSection(): Promise<React.ReactElement> {
  const jogos = await new MongoJogoRepository().findProximos();

  return (
    <section id="agenda">
      <div className="mx-auto w-fit max-w-xl rounded-lg bg-card px-6 py-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground">Agenda de Jogos</h2>
      </div>

      {jogos.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nenhum jogo agendado no momento.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {jogos.map((jogo) => (
            <Card key={jogo.id} className="relative">
              <Link
                href="/carona"
                className="absolute right-4 top-4 flex w-16 flex-col items-center gap-1 text-center text-[10px] font-semibold leading-tight text-muted-foreground hover:text-foreground"
              >
                <Car size={16} />
                Pode ajudar com carona?
              </Link>

              <div className="flex items-start gap-3 pr-16">
                <ConfrontoEscudos adversarioEscudoUrl={jogo.adversarioEscudoUrl} mandante={jogo.mandante} />
                <div>
                  <p className="font-semibold text-foreground">
                    {tituloConfronto(jogo.adversario, jogo.mandante)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {jogo.local}
                    {jogo.mandante === "ADVERSARIO" ? " · Fora" : ""}
                  </p>
                  <p className="text-sm text-planalto-red">{formatDataHora(jogo.dataHora)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
