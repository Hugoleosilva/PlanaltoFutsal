import { CaronaSolidaria } from "@/core/domain/carona/carona-solidaria.entity";
import { CaronaSolidariaRepository } from "@/core/domain/carona/carona-solidaria.repository";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";

export interface OferecerCaronaIn {
  jogoId: string;
  motoristaNome: string;
  contato: string;
  horarioSaida: Date;
  local: string;
  vagasDisponiveis: number;
  criadoPorUserId?: string | null;
}

export interface OferecerCaronaOut {
  carona: CaronaSolidaria;
}

export class OferecerCaronaUseCase implements UseCase<OferecerCaronaIn, OferecerCaronaOut> {
  constructor(
    private readonly caronaRepository: CaronaSolidariaRepository,
    private readonly jogoRepository: JogoRepository,
  ) {}

  async execute(input: OferecerCaronaIn): Promise<OferecerCaronaOut> {
    const jogo = await this.jogoRepository.findById(input.jogoId);
    if (!jogo) throw new NotFoundError("Jogo não encontrado.");

    const carona = CaronaSolidaria.create({
      jogoId: input.jogoId,
      motoristaNome: input.motoristaNome,
      contato: input.contato,
      horarioSaida: input.horarioSaida,
      local: input.local,
      vagasDisponiveis: input.vagasDisponiveis,
      criadoPorUserId: input.criadoPorUserId ?? null,
    });

    const salva = await this.caronaRepository.create(carona);

    return { carona: salva };
  }
}
