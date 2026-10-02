import { Jogo } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface RegistrarResultadoJogoIn {
  actor: AuthenticatedActor;
  jogoId: string;
  placarPlanalto: number;
  placarAdversario: number;
}

export interface RegistrarResultadoJogoOut {
  jogo: Jogo;
}

export class RegistrarResultadoJogoUseCase
  implements UseCase<RegistrarResultadoJogoIn, RegistrarResultadoJogoOut>
{
  constructor(private readonly jogoRepository: JogoRepository) {}

  async execute({
    actor,
    jogoId,
    placarPlanalto,
    placarAdversario,
  }: RegistrarResultadoJogoIn): Promise<RegistrarResultadoJogoOut> {
    assertRole(actor, ["ADMIN"]);

    const jogo = await this.jogoRepository.findById(jogoId);
    if (!jogo) throw new NotFoundError("Jogo não encontrado.");

    const atualizado = jogo.registrarResultado(placarPlanalto, placarAdversario);
    const salvo = await this.jogoRepository.update(atualizado);

    return { jogo: salvo };
  }
}
