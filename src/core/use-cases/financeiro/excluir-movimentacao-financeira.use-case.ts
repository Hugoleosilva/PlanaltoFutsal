import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { MovimentacaoFinanceiraRepository } from "@/core/domain/financeiro/movimentacao-financeira.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface ExcluirMovimentacaoFinanceiraIn {
  actor: AuthenticatedActor;
  movimentacaoId: string;
}

export type ExcluirMovimentacaoFinanceiraOut = void;

export class ExcluirMovimentacaoFinanceiraUseCase
  implements UseCase<ExcluirMovimentacaoFinanceiraIn, ExcluirMovimentacaoFinanceiraOut>
{
  constructor(
    private readonly movimentacaoRepository: MovimentacaoFinanceiraRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute({ actor, movimentacaoId }: ExcluirMovimentacaoFinanceiraIn): Promise<void> {
    assertRole(actor, ["ADMIN"]);

    const movimentacao = await this.movimentacaoRepository.findById(movimentacaoId);
    if (!movimentacao) throw new NotFoundError("Movimentação financeira não encontrada.");

    await this.movimentacaoRepository.delete(movimentacaoId);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "MOVIMENTACAO_FINANCEIRA_EXCLUIDA",
        actorUserId: actor.id,
        entityType: "MovimentacaoFinanceira",
        entityId: movimentacaoId,
        metadata: { tipo: movimentacao.tipo, valor: movimentacao.valor },
      }),
    );
  }
}
