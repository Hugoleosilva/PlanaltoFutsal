import Link from "next/link";
import { Car } from "lucide-react";
import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { ConfrontoEscudos } from "./confronto-escudos";
import { tituloConfronto } from "./confronto-texto";

function formatDataHora(data?: Date | null): string {
  if (!data) return "Data e Hora ainda não definidas!";
  return data.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" });
}

export async function AgendaSection(): Promise<React.ReactElement> {
  const jogos = await new MongoJogoRepository().findProximos();

  return (
    <section id="agenda">
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
            <Card key={jogo.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ConfrontoEscudos adversarioEscudoUrl={jogo.adversarioEscudoUrl} mandante={jogo.mandante} />
                  <div>
                    <p className="font-semibold text-planalto-white">
                      {tituloConfronto(jogo.adversario, jogo.mandante)}
                    </p>
                    <p className="text-sm text-planalto-gray">
                      {jogo.local}
                      {jogo.mandante === "ADVERSARIO" ? " · Fora" : ""}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-right text-sm text-planalto-red">
                  {formatDataHora(jogo.dataHora)}
                </p>
              </div>

              <Link
                href="/carona"
                className="mt-3 flex items-center justify-center gap-1.5 border-t border-white/10 pt-3 text-xs font-semibold text-planalto-gray hover:text-planalto-white"
              >
                <Car size={14} />
                Pode ajudar com uma carona? Clique aqui
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
