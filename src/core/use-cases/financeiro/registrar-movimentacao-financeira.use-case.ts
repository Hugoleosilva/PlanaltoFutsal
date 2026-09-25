import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import {
  MovimentacaoFinanceira,
  TipoMovimentacao,
} from "@/core/domain/financeiro/movimentacao-financeira.entity";
import { MovimentacaoFinanceiraRepository } from "@/core/domain/financeiro/movimentacao-financeira.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface RegistrarMovimentacaoFinanceiraIn {
  actor: AuthenticatedActor;
  tipo: TipoMovimentacao;
  descricao: string;
  valor: number;
  data: Date;
  categoria?: string;
  campeonatoId?: string | null;
}

export interface RegistrarMovimentacaoFinanceiraOut {
  movimentacao: MovimentacaoFinanceira;
}

export class RegistrarMovimentacaoFinanceiraUseCase
  implements UseCase<RegistrarMovimentacaoFinanceiraIn, RegistrarMovimentacaoFinanceiraOut>
{
  constructor(
    private readonly movimentacaoRepository: MovimentacaoFinanceiraRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(
    input: RegistrarMovimentacaoFinanceiraIn,
  ): Promise<RegistrarMovimentacaoFinanceiraOut> {
    assertRole(input.actor, ["ADMIN"]);

    const movimentacao = MovimentacaoFinanceira.create({
      tipo: input.tipo,
      descricao: input.descricao,
      valor: input.valor,
      data: input.data,
      categoria: input.categoria,
      campeonatoId: input.campeonatoId ?? null,
      registradoPorUserId: input.actor.id,
    });

    const salva = await this.movimentacaoRepository.create(movimentacao);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "MOVIMENTACAO_FINANCEIRA_CRIADA",
        actorUserId: input.actor.id,
        entityType: "MovimentacaoFinanceira",
        entityId: salva.id,
        metadata: { tipo: salva.tipo, valor: salva.valor },
      }),
    );

    return { movimentacao: salva };
  }
}
