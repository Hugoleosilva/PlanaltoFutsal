import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoContribuicaoSocioRepository } from "@/infrastructure/database/repositories/contribuicao-socio.repository.mongo";
import { ContribuicaoSocio } from "@/core/domain/socio/contribuicao-socio.entity";
import { MarcarRecebidoButton } from "./marcar-recebido-button";
import { Badge } from "@/shared/components/ui/badge";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(data: Date): string {
  return data.toLocaleDateString("pt-BR", { timeZone: "America/Recife" });
}

function referenciaDoMes(data: Date): string {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

export default async function SociosPage(): Promise<React.ReactElement> {
  const userRepository = new MongoUserRepository();
  const contribuicaoRepository = new MongoContribuicaoSocioRepository();

  const socios = await userRepository.findSocios();

  const agora = new Date();
  const referenciaAtual = referenciaDoMes(agora);

  await Promise.all(
    socios
      .filter((socio) => socio.socioTipoPlano === "MENSAL")
      .map(async (socio) => {
        const existente = await contribuicaoRepository.findByReferenciaUsuario(socio.id, referenciaAtual);
        if (existente) return;

        const diaVencimento = Math.min(28, socio.socioDiaVencimento ?? 5);
        const dataVencimento = new Date(agora.getFullYear(), agora.getMonth(), diaVencimento);

        await contribuicaoRepository.create(
          ContribuicaoSocio.create({
            userId: socio.id,
            tipo: "MENSAL",
            referencia: referenciaAtual,
            valor: socio.socioValorPlano ?? 5,
            status: "PENDENTE",
            dataVencimento,
          }),
        );
      }),
  );

  const todasContribuicoes = await contribuicaoRepository.findAll();
  const contribuicaoMaisRelevantePorSocio = new Map<string, (typeof todasContribuicoes)[number]>();

  for (const contribuicao of todasContribuicoes) {
    const atual = contribuicaoMaisRelevantePorSocio.get(contribuicao.userId);
    if (!atual) {
      contribuicaoMaisRelevantePorSocio.set(contribuicao.userId, contribuicao);
      continue;
    }
    const prioridade = (c: typeof contribuicao) => (c.isPendente ? 1 : 0);
    if (
      prioridade(contribuicao) > prioridade(atual) ||
      (prioridade(contribuicao) === prioridade(atual) &&
        contribuicao.dataVencimento > atual.dataVencimento)
    ) {
      contribuicaoMaisRelevantePorSocio.set(contribuicao.userId, contribuicao);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Sócios — Planalto Meu Amor!
        </h1>
        <p className="mt-1 text-muted-foreground">
          {socios.length} sócio(s). O Pix aqui não tem cobrança automática — confira o recebimento
          e marque manualmente.
        </p>
      </div>

      {socios.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ninguém aderiu ao Planalto Meu Amor! ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-surface/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface/10 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Sócio</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Contribuição atual</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {socios.map((socio) => {
                const contribuicao = contribuicaoMaisRelevantePorSocio.get(socio.id);

                return (
                  <tr key={socio.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{socio.name}</p>
                      <p className="text-xs text-muted-foreground">{socio.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {socio.socioTipoPlano === "MENSAL"
                        ? `Mensal · ${formatBRL(socio.socioValorPlano ?? 0)} · todo dia ${socio.socioDiaVencimento}`
                        : socio.socioTipoPlano === "UNICO"
                          ? `Único · ${formatBRL(socio.socioValorPlano ?? 0)}`
                          : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {contribuicao ? (
                        <div className="flex items-center gap-2">
                          <Badge tone={contribuicao.isPendente ? "warning" : "success"}>
                            {contribuicao.isPendente ? "Pendente" : "Pago"}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatBRL(contribuicao.valor)} · venc. {formatData(contribuicao.dataVencimento)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {contribuicao?.isPendente ? (
                        <MarcarRecebidoButton contribuicaoId={contribuicao.id} />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
