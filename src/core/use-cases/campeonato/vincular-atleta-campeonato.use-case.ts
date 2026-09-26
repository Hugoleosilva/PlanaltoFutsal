import { InscricaoCampeonato } from "@/core/domain/campeonato/inscricao-campeonato.entity";
import {
  CampeonatoRepository,
  InscricaoCampeonatoRepository,
} from "@/core/domain/campeonato/campeonato.repository";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface VincularAtletaCampeonatoIn {
  actor: AuthenticatedActor;
  campeonatoId: string;
  atletaId: string;
  categoria?: string;
}

export interface VincularAtletaCampeonatoOut {
  inscricao: InscricaoCampeonato;
}

export class VincularAtletaCampeonatoUseCase
  implements UseCase<VincularAtletaCampeonatoIn, VincularAtletaCampeonatoOut>
{
  constructor(
    private readonly campeonatoRepository: CampeonatoRepository,
    private readonly atletaRepository: AtletaRepository,
    private readonly inscricaoRepository: InscricaoCampeonatoRepository,
  ) {}

  async execute(input: VincularAtletaCampeonatoIn): Promise<VincularAtletaCampeonatoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const campeonato = await this.campeonatoRepository.findById(input.campeonatoId);
    if (!campeonato) throw new NotFoundError("Campeonato não encontrado.");

    const atleta = await this.atletaRepository.findById(input.atletaId);
    if (!atleta) throw new NotFoundError("Atleta não encontrado.");

    const jaInscrito = await this.inscricaoRepository.findByCampeonato(input.campeonatoId);
    if (jaInscrito.some((inscricao) => inscricao.atletaId === input.atletaId)) {
      throw new AppError("Este atleta já está vinculado a este campeonato.", "ATLETA_JA_VINCULADO", 409);
    }

    const inscricao = InscricaoCampeonato.create({
      campeonatoId: input.campeonatoId,
      atletaId: input.atletaId,
      categoria: input.categoria,
    });

    const salva = await this.inscricaoRepository.create(inscricao);

    return { inscricao: salva };
  }
}
