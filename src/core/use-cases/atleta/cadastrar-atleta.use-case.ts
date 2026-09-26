import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Atleta, AtletaPosicao } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CadastrarAtletaIn {
  actor: AuthenticatedActor;
  userId?: string | null;
  nomeCompleto: string;
  apelido: string;
  dataNascimento: Date;
  posicao?: AtletaPosicao | null;
  bio?: string;
  estiloDeJogo?: string;
  preferencias?: string;
  contatoEmail?: string;
  contatoWhatsapp?: string;
}

export interface CadastrarAtletaOut {
  atleta: Atleta;
}

export class CadastrarAtletaUseCase implements UseCase<CadastrarAtletaIn, CadastrarAtletaOut> {
  constructor(
    private readonly atletaRepository: AtletaRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: CadastrarAtletaIn): Promise<CadastrarAtletaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const atleta = Atleta.create({
      userId: input.userId ?? null,
      nomeCompleto: input.nomeCompleto,
      apelido: input.apelido,
      dataNascimento: input.dataNascimento,
      galeriaFotosUrls: [],
      documentos: [],
      posicao: input.posicao ?? null,
      bio: input.bio,
      estiloDeJogo: input.estiloDeJogo,
      preferencias: input.preferencias,
      contatoEmail: input.contatoEmail,
      contatoWhatsapp: input.contatoWhatsapp,
      status: "ATIVO",
    });

    const salvo = await this.atletaRepository.create(atleta);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "ATLETA_CRIADO",
        actorUserId: input.actor.id,
        entityType: "Atleta",
        entityId: salvo.id,
      }),
    );

    return { atleta: salvo };
  }
}
