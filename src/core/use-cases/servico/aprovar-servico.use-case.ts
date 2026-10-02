import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Servico } from "@/core/domain/servico/servico.entity";
import { ServicoRepository } from "@/core/domain/servico/servico.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface AprovarServicoIn {
  actor: AuthenticatedActor;
  servicoId: string;
}

export interface AprovarServicoOut {
  servico: Servico;
}

export class AprovarServicoUseCase implements UseCase<AprovarServicoIn, AprovarServicoOut> {
  constructor(
    private readonly servicoRepository: ServicoRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute({ actor, servicoId }: AprovarServicoIn): Promise<AprovarServicoOut> {
    assertRole(actor, ["ADMIN"]);

    const servico = await this.servicoRepository.findById(servicoId);
    if (!servico) throw new NotFoundError("Serviço não encontrado.");

    const aprovado = servico.aprovar(actor.id);
    await this.servicoRepository.update(aprovado);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "SERVICO_APROVADO",
        actorUserId: actor.id,
        entityType: "Servico",
        entityId: aprovado.id,
      }),
    );

    return { servico: aprovado };
  }
}
