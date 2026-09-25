import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface DesativarAtletaIn {
  actor: AuthenticatedActor;
  atletaId: string;
}

export interface DesativarAtletaOut {
  atleta: Atleta;
}

export class DesativarAtletaUseCase implements UseCase<DesativarAtletaIn, DesativarAtletaOut> {
  constructor(
    private readonly atletaRepository: AtletaRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute({ actor, atletaId }: DesativarAtletaIn): Promise<DesativarAtletaOut> {
    assertRole(actor, ["ADMIN"]);

    const atleta = await this.atletaRepository.findById(atletaId);
    if (!atleta) throw new NotFoundError("Atleta não encontrado.");

    const desativado = atleta.desativar();
    await this.atletaRepository.update(desativado);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "ATLETA_DESATIVADO",
        actorUserId: actor.id,
        entityType: "Atleta",
        entityId: desativado.id,
      }),
    );

    return { atleta: desativado };
  }
}
