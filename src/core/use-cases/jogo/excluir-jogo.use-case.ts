import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface ExcluirJogoIn {
  actor: AuthenticatedActor;
  jogoId: string;
}

export type ExcluirJogoOut = void;

export class ExcluirJogoUseCase implements UseCase<ExcluirJogoIn, ExcluirJogoOut> {
  constructor(private readonly jogoRepository: JogoRepository) {}

  async execute({ actor, jogoId }: ExcluirJogoIn): Promise<void> {
    assertRole(actor, ["ADMIN"]);

    const jogo = await this.jogoRepository.findById(jogoId);
    if (!jogo) throw new NotFoundError("Jogo não encontrado.");

    await this.jogoRepository.delete(jogoId);
  }
}
