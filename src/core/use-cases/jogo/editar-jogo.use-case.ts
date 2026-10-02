import { Jogo, Mandante } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { NotFoundError } from "@/infrastructure/errors";

export interface EditarJogoIn {
  actor: AuthenticatedActor;
  jogoId: string;
  adversario: string;
  adversarioEscudoUrl?: string | null;
  dataHora?: Date | null;
  local: string;
  campeonatoId?: string | null;
  mandante?: Mandante;
}

export interface EditarJogoOut {
  jogo: Jogo;
}

/**
 * Edita um jogo já cadastrado (inclusive já realizado) sem mexer em
 * status/placar — usado principalmente pra trocar o escudo do adversário
 * sem precisar excluir e recriar o registro.
 */
export class EditarJogoUseCase implements UseCase<EditarJogoIn, EditarJogoOut> {
  constructor(private readonly jogoRepository: JogoRepository) {}

  async execute(input: EditarJogoIn): Promise<EditarJogoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const jogo = await this.jogoRepository.findById(input.jogoId);
    if (!jogo) throw new NotFoundError("Jogo não encontrado.");

    const atualizado = jogo.clone({
      adversario: input.adversario,
      adversarioEscudoUrl: input.adversarioEscudoUrl ?? null,
      dataHora: input.dataHora ?? null,
      local: input.local,
      campeonatoId: input.campeonatoId ?? null,
      mandante: input.mandante ?? "PLANALTO",
    });

    const salvo = await this.jogoRepository.update(atualizado);

    return { jogo: salvo };
  }
}
