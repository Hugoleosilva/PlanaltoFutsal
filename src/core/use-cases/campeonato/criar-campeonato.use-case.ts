import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { Campeonato } from "@/core/domain/campeonato/campeonato.entity";
import { CampeonatoRepository } from "@/core/domain/campeonato/campeonato.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CriarCampeonatoIn {
  actor: AuthenticatedActor;
  nome: string;
  dataInicio?: Date | null;
  diasDeJogo?: string[];
  horarios?: string[];
  taxaInscricao?: number | null;
  taxaArbitragem?: number | null;
}

export interface CriarCampeonatoOut {
  campeonato: Campeonato;
}

export class CriarCampeonatoUseCase implements UseCase<CriarCampeonatoIn, CriarCampeonatoOut> {
  constructor(
    private readonly campeonatoRepository: CampeonatoRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: CriarCampeonatoIn): Promise<CriarCampeonatoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const campeonato = Campeonato.create({
      nome: input.nome,
      dataInicio: input.dataInicio ?? null,
      diasDeJogo: input.diasDeJogo ?? [],
      horarios: input.horarios ?? [],
      taxaInscricao: input.taxaInscricao ?? null,
      taxaArbitragem: input.taxaArbitragem ?? null,
      status: "OPORTUNIDADE",
    });

    const salvo = await this.campeonatoRepository.create(campeonato);

    await this.auditLogRepository.create(
      AuditLog.create({
        action: "CAMPEONATO_CRIADO",
        actorUserId: input.actor.id,
        entityType: "Campeonato",
        entityId: salvo.id,
      }),
    );

    return { campeonato: salvo };
  }
}
