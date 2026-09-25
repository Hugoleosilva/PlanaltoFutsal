import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Foto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface RejeitarFotoIn {
  actor: AuthenticatedActor;
  fotoId: string;
}

export interface RejeitarFotoOut {
  foto: Foto;
}

export class RejeitarFotoUseCase implements UseCase<RejeitarFotoIn, RejeitarFotoOut> {
  constructor(
    private readonly fotoRepository: FotoRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute({ actor, fotoId }: RejeitarFotoIn): Promise<RejeitarFotoOut> {
    assertRole(actor, ["ADMIN"]);

    const foto = await this.fotoRepository.findById(fotoId);
    if (!foto) throw new NotFoundError("Foto não encontrada.");

    const fotoRejeitada = foto.rejeitar(actor.id);
    await this.fotoRepository.update(fotoRejeitada);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "FOTO_REJEITADA",
        actorUserId: actor.id,
        entityType: "Foto",
        entityId: fotoRejeitada.id,
      }),
    );

    return { foto: fotoRejeitada };
  }
}
