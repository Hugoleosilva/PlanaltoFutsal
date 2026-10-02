import { Jogo, Mandante } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CadastrarJogoIn {
  actor: AuthenticatedActor;
  adversario: string;
  adversarioEscudoUrl?: string | null;
  dataHora?: Date | null;
  local: string;
  campeonatoId?: string | null;
  mandante?: Mandante;
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
      adversarioEscudoUrl: input.adversarioEscudoUrl ?? null,
      dataHora: input.dataHora ?? null,
      local: input.local,
      campeonatoId: input.campeonatoId ?? null,
      status: "AGENDADO",
      mandante: input.mandante ?? "PLANALTO",
    });

    const salvo = await this.jogoRepository.create(jogo);

    return { jogo: salvo };
  }
}
