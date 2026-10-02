import { MembroDiretoria } from "@/core/domain/diretoria/membro-diretoria.entity";
import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CadastrarMembroDiretoriaIn {
  actor: AuthenticatedActor;
  nome: string;
  funcao: string;
  fotoUrl?: string | null;
  bio?: string;
  ordem?: number;
  contato?: string;
}

export interface CadastrarMembroDiretoriaOut {
  membro: MembroDiretoria;
}

export class CadastrarMembroDiretoriaUseCase
  implements UseCase<CadastrarMembroDiretoriaIn, CadastrarMembroDiretoriaOut>
{
  constructor(private readonly membroRepository: MembroDiretoriaRepository) {}

  async execute(input: CadastrarMembroDiretoriaIn): Promise<CadastrarMembroDiretoriaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const membro = MembroDiretoria.create({
      nome: input.nome,
      funcao: input.funcao,
      fotoUrl: input.fotoUrl ?? null,
      bio: input.bio,
      ordem: input.ordem ?? 0,
      contato: input.contato,
      status: "ATIVO",
    });

    const salvo = await this.membroRepository.create(membro);

    return { membro: salvo };
  }
}
