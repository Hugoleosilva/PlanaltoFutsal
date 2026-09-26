import { Jogo } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CadastrarJogoIn {
  actor: AuthenticatedActor;
  adversario: string;
  dataHora: Date;
  local: string;
  campeonatoId?: string | null;
}

export interface CadastrarJogoOut {
  jogo: Jogo;
}

export class CadastrarJogoUseCase implements UseCase<CadastrarJogoIn, CadastrarJogoOut> {
  constructor(private readonly jogoRepository: JogoRepository) {}

  async execute(input: CadastrarJogoIn): Promise<CadastrarJogoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const jogo = Jogo.create({
      adversario: input.adversario,
      dataHora: input.dataHora,
      local: input.local,
      campeonatoId: input.campeonatoId ?? null,
      status: "AGENDADO",
    });

    const salvo = await this.jogoRepository.create(jogo);

    return { jogo: salvo };
  }
}
