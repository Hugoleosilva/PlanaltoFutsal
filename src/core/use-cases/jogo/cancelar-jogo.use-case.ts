import { Jogo } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CancelarJogoIn {
  actor: AuthenticatedActor;
  jogoId: string;
}

export interface CancelarJogoOut {
  jogo: Jogo;
}

export class CancelarJogoUseCase implements UseCase<CancelarJogoIn, CancelarJogoOut> {
  constructor(private readonly jogoRepository: JogoRepository) {}

  async execute({ actor, jogoId }: CancelarJogoIn): Promise<CancelarJogoOut> {
    assertRole(actor, ["ADMIN"]);

    const jogo = await this.jogoRepository.findById(jogoId);
    if (!jogo) throw new NotFoundError("Jogo não encontrado.");

    const cancelado = jogo.cancelar();
    const salvo = await this.jogoRepository.update(cancelado);

    return { jogo: salvo };
  }
}
