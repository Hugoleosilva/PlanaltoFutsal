import { MongoJogoRepository } from "@/infrastructure/database/repositories/jogo.repository.mongo";
import { tituloConfronto } from "./confronto-texto";

function formatDataHora(data?: Date | null): string {
  if (!data) return "Data e Hora ainda não definidas!";
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export async function ProximoJogoTicker(): Promise<React.ReactElement> {
  const [proximoJogo] = await new MongoJogoRepository().findProximos();

  if (!proximoJogo) return <></>;

  return (
    <div className="border-b border-white/10 bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm">
        <p className="text-planalto-white">
          <span className="font-semibold">Próximo jogo:</span>{" "}
          {tituloConfronto(proximoJogo.adversario, proximoJogo.mandante)} · {proximoJogo.local}
        </p>
        <p className="text-planalto-red">{formatDataHora(proximoJogo.dataHora)}</p>
      </div>
    </div>
  );
}
