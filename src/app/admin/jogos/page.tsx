import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { JogoForm } from "./jogo-form";
import { CancelarJogoButton } from "./cancelar-jogo-button";

function formatDataHora(data: Date): string {
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const STATUS_TONE: Record<string, "neutral" | "success" | "danger"> = {
  AGENDADO: "neutral",
  REALIZADO: "success",
  CANCELADO: "danger",
};

export default async function JogosPage(): Promise<React.ReactElement> {
  const jogos = await new MongoJogoRepository().findAll();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Jogos</h1>
        <p className="mt-1 text-planalto-gray">Agenda exibida no Portal Público.</p>
      </div>

      <JogoForm />

      <Card>
        <h2 className="font-heading text-lg font-bold text-planalto-white">Todos os jogos</h2>

        {jogos.length === 0 ? (
          <p className="mt-4 text-sm text-planalto-gray">Nenhum jogo cadastrado ainda.</p>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {jogos.map((jogo) => (
              <div key={jogo.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-planalto-white">
                    Planalto Futsal x {jogo.adversario}
                  </p>
                  <p className="text-xs text-planalto-gray">
                    {formatDataHora(jogo.dataHora)} · {jogo.local}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge tone={STATUS_TONE[jogo.status]}>{jogo.status}</Badge>
                  {jogo.status === "AGENDADO" ? <CancelarJogoButton id={jogo.id} /> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
