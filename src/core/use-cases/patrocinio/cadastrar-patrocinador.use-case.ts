import { Patrocinador } from "@/core/domain/patrocinio/patrocinador.entity";
import { PatrocinadorRepository } from "@/core/domain/patrocinio/patrocinio-loja.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CadastrarPatrocinadorIn {
  actor: AuthenticatedActor;
  nome: string;
  logoUrl: string;
  depoimento?: string;
  link?: string;
  ordem?: number;
  escala?: number;
}

export interface CadastrarPatrocinadorOut {
  patrocinador: Patrocinador;
}

export class CadastrarPatrocinadorUseCase
  implements UseCase<CadastrarPatrocinadorIn, CadastrarPatrocinadorOut>
{
  constructor(private readonly patrocinadorRepository: PatrocinadorRepository) {}

  async execute(input: CadastrarPatrocinadorIn): Promise<CadastrarPatrocinadorOut> {
    assertRole(input.actor, ["ADMIN"]);

    const patrocinador = Patrocinador.create({
      nome: input.nome,
      logoUrl: input.logoUrl,
      depoimento: input.depoimento,
      link: input.link,
      ativo: true,
      ordem: input.ordem ?? 0,
      escala: input.escala ?? 100,
    });

    const salvo = await this.patrocinadorRepository.create(patrocinador);

    return { patrocinador: salvo };
  }
}
