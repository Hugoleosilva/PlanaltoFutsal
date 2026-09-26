import { Comunicado, TipoComunicado } from "@/core/domain/engajamento/comunicado.entity";
import { ComunicadoRepository } from "@/core/domain/engajamento/engajamento.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface PublicarComunicadoIn {
  actor: AuthenticatedActor;
  titulo: string;
  corpo: string;
  tipo: TipoComunicado;
  fixado: boolean;
}

export interface PublicarComunicadoOut {
  comunicado: Comunicado;
}

export class PublicarComunicadoUseCase implements UseCase<PublicarComunicadoIn, PublicarComunicadoOut> {
  constructor(private readonly comunicadoRepository: ComunicadoRepository) {}

  async execute(input: PublicarComunicadoIn): Promise<PublicarComunicadoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const comunicado = Comunicado.create({
      titulo: input.titulo,
      corpo: input.corpo,
      tipo: input.tipo,
      fixado: input.fixado,
      autorUserId: input.actor.id,
      publicadoEm: new Date(),
    });

    const salvo = await this.comunicadoRepository.create(comunicado);

    return { comunicado: salvo };
  }
}
