import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Servico } from "@/core/domain/servico/servico.entity";
import { ServicoRepository } from "@/core/domain/servico/servico.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface RejeitarServicoIn {
  actor: AuthenticatedActor;
  servicoId: string;
}

export interface RejeitarServicoOut {
  servico: Servico;
}

export class RejeitarServicoUseCase implements UseCase<RejeitarServicoIn, RejeitarServicoOut> {
  constructor(
    private readonly servicoRepository: ServicoRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute({ actor, servicoId }: RejeitarServicoIn): Promise<RejeitarServicoOut> {
    assertRole(actor, ["ADMIN"]);

    const servico = await this.servicoRepository.findById(servicoId);
    if (!servico) throw new NotFoundError("Serviço não encontrado.");

    const rejeitado = servico.rejeitar(actor.id);
    await this.servicoRepository.update(rejeitado);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "SERVICO_REJEITADO",
        actorUserId: actor.id,
        entityType: "Servico",
        entityId: rejeitado.id,
      }),
    );

    return { servico: rejeitado };
  }
}
