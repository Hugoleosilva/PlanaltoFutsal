import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { NotFoundError } from "@/infrastructure/errors";

export interface DesativarMembroDiretoriaIn {
  actor: AuthenticatedActor;
  membroId: string;
}

export interface DesativarMembroDiretoriaOut {
  membroId: string;
}

export class DesativarMembroDiretoriaUseCase
  implements UseCase<DesativarMembroDiretoriaIn, DesativarMembroDiretoriaOut>
{
  constructor(private readonly membroRepository: MembroDiretoriaRepository) {}

  async execute(input: DesativarMembroDiretoriaIn): Promise<DesativarMembroDiretoriaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const membro = await this.membroRepository.findById(input.membroId);
    if (!membro) throw new NotFoundError("Membro da diretoria não encontrado.");

    await this.membroRepository.update(membro.desativar());

    return { membroId: membro.id };
  }
}
