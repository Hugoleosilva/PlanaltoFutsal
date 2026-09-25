import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Foto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface AprovarFotoIn {
  actor: AuthenticatedActor;
  fotoId: string;
}

export interface AprovarFotoOut {
  foto: Foto;
}

export class AprovarFotoUseCase implements UseCase<AprovarFotoIn, AprovarFotoOut> {
  constructor(
    private readonly fotoRepository: FotoRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute({ actor, fotoId }: AprovarFotoIn): Promise<AprovarFotoOut> {
    assertRole(actor, ["ADMIN"]);

    const foto = await this.fotoRepository.findById(fotoId);
    if (!foto) throw new NotFoundError("Foto não encontrada.");

    const fotoAprovada = foto.aprovar(actor.id);
    await this.fotoRepository.update(fotoAprovada);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "FOTO_APROVADA",
        actorUserId: actor.id,
        entityType: "Foto",
        entityId: fotoAprovada.id,
      }),
    );

    return { foto: fotoAprovada };
  }
}
