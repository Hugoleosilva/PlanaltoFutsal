import { Patrocinador } from "@/core/domain/patrocinio/patrocinador.entity";
import { PatrocinadorRepository } from "@/core/domain/patrocinio/patrocinio-loja.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface EditarPatrocinadorIn {
  actor: AuthenticatedActor;
  patrocinadorId: string;
  nome: string;
  logoUrl: string;
  depoimento?: string;
  link?: string;
  ordem?: number;
  escala?: number;
}

export interface EditarPatrocinadorOut {
  patrocinador: Patrocinador;
}

export class EditarPatrocinadorUseCase implements UseCase<EditarPatrocinadorIn, EditarPatrocinadorOut> {
  constructor(private readonly patrocinadorRepository: PatrocinadorRepository) {}

  async execute(input: EditarPatrocinadorIn): Promise<EditarPatrocinadorOut> {
    assertRole(input.actor, ["ADMIN"]);

    const patrocinador = await this.patrocinadorRepository.findById(input.patrocinadorId);
    if (!patrocinador) throw new NotFoundError("Patrocinador não encontrado.");

    const editado = patrocinador.editar({
      nome: input.nome,
      logoUrl: input.logoUrl,
      depoimento: input.depoimento,
      link: input.link,
      ordem: input.ordem ?? patrocinador.ordem,
      escala: input.escala ?? patrocinador.escala,
    });

    const salvo = await this.patrocinadorRepository.update(editado);

    return { patrocinador: salvo };
  }
}
