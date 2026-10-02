import { PatrocinadorRepository } from "@/core/domain/patrocinio/patrocinio-loja.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface DesativarPatrocinadorIn {
  actor: AuthenticatedActor;
  patrocinadorId: string;
}

export interface DesativarPatrocinadorOut {
  patrocinadorId: string;
}

export class DesativarPatrocinadorUseCase
  implements UseCase<DesativarPatrocinadorIn, DesativarPatrocinadorOut>
{
  constructor(private readonly patrocinadorRepository: PatrocinadorRepository) {}

  async execute(input: DesativarPatrocinadorIn): Promise<DesativarPatrocinadorOut> {
    assertRole(input.actor, ["ADMIN"]);

    const patrocinador = await this.patrocinadorRepository.findById(input.patrocinadorId);
    if (!patrocinador) throw new NotFoundError("Patrocinador não encontrado.");

    await this.patrocinadorRepository.update(patrocinador.desativar());

    return { patrocinadorId: patrocinador.id };
  }
}
