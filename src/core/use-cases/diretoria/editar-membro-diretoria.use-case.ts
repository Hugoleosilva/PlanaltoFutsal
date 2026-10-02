import { MembroDiretoria } from "@/core/domain/diretoria/membro-diretoria.entity";
import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { NotFoundError } from "@/infrastructure/errors";

export interface EditarMembroDiretoriaIn {
  actor: AuthenticatedActor;
  membroId: string;
  nome?: string;
  funcao?: string;
  fotoUrl?: string | null;
  bio?: string;
  ordem?: number;
  contato?: string;
}

export interface EditarMembroDiretoriaOut {
  membro: MembroDiretoria;
}

export class EditarMembroDiretoriaUseCase
  implements UseCase<EditarMembroDiretoriaIn, EditarMembroDiretoriaOut>
{
  constructor(private readonly membroRepository: MembroDiretoriaRepository) {}

  async execute(input: EditarMembroDiretoriaIn): Promise<EditarMembroDiretoriaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const membro = await this.membroRepository.findById(input.membroId);
    if (!membro) throw new NotFoundError("Membro da diretoria não encontrado.");

    const editado = membro.clone({
      nome: input.nome ?? membro.nome,
      funcao: input.funcao ?? membro.funcao,
      fotoUrl: input.fotoUrl !== undefined ? input.fotoUrl : membro.fotoUrl,
      bio: input.bio ?? membro.bio,
      ordem: input.ordem ?? membro.ordem,
      contato: input.contato ?? membro.contato,
    });

    const salvo = await this.membroRepository.update(editado);

    return { membro: salvo };
  }
}
