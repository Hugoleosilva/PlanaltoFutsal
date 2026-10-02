import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Atleta, AtletaPosicao } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface EditarAtletaIn {
  actor: AuthenticatedActor;
  atletaId: string;
  nomeCompleto?: string;
  apelido?: string;
  dataNascimento?: Date;
  posicao?: AtletaPosicao | null;
  bio?: string;
  estiloDeJogo?: string;
  preferencias?: string;
  fotoPrincipalUrl?: string | null;
  contatoEmail?: string;
  contatoWhatsapp?: string;
}

export interface EditarAtletaOut {
  atleta: Atleta;
}

export class EditarAtletaUseCase implements UseCase<EditarAtletaIn, EditarAtletaOut> {
  constructor(
    private readonly atletaRepository: AtletaRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: EditarAtletaIn): Promise<EditarAtletaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const atleta = await this.atletaRepository.findById(input.atletaId);
    if (!atleta) throw new NotFoundError("Atleta não encontrado.");

    const editado = atleta.clone({
      nomeCompleto: input.nomeCompleto ?? atleta.nomeCompleto,
      apelido: input.apelido ?? atleta.apelido,
      dataNascimento: input.dataNascimento ?? atleta.dataNascimento,
      posicao: input.posicao !== undefined ? input.posicao : atleta.posicao,
      bio: input.bio ?? atleta.bio,
      estiloDeJogo: input.estiloDeJogo ?? atleta.estiloDeJogo,
      preferencias: input.preferencias ?? atleta.preferencias,
      fotoPrincipalUrl:
        input.fotoPrincipalUrl !== undefined ? input.fotoPrincipalUrl : atleta.fotoPrincipalUrl,
      contatoEmail: input.contatoEmail ?? atleta.contatoEmail,
      contatoWhatsapp: input.contatoWhatsapp ?? atleta.contatoWhatsapp,
    });

    const salvo = await this.atletaRepository.update(editado);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "ATLETA_EDITADO",
        actorUserId: input.actor.id,
        entityType: "Atleta",
        entityId: salvo.id,
      }),
    );

    return { atleta: salvo };
  }
}
