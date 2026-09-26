import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface AdicionarFotoGaleriaIn {
  actor: AuthenticatedActor;
  url: string;
}

export interface RemoverFotoGaleriaIn {
  actor: AuthenticatedActor;
  url: string;
}

export interface GaleriaAtletaOut {
  atleta: Atleta;
}

/**
 * A validação de "no máximo 4 fotos na galeria" já está garantida pelo
 * MaxItemsRule dentro de Atleta.validate() — clone() dispara essa validação
 * de novo, então o 5º item sempre lança ValidationException sem precisar
 * duplicar a regra aqui.
 */
export class AdicionarFotoGaleriaUseCase implements UseCase<AdicionarFotoGaleriaIn, GaleriaAtletaOut> {
  constructor(private readonly atletaRepository: AtletaRepository) {}

  async execute({ actor, url }: AdicionarFotoGaleriaIn): Promise<GaleriaAtletaOut> {
    assertRole(actor, ["ATLETA"]);

    const atleta = await this.atletaRepository.findByUserId(actor.id);
    if (!atleta) throw new NotFoundError("Perfil de atleta não encontrado para este usuário.");

    const atualizado = atleta.clone({
      galeriaFotosUrls: [...atleta.galeriaFotosUrls, url],
    });

    const salvo = await this.atletaRepository.update(atualizado);

    return { atleta: salvo };
  }
}

export class RemoverFotoGaleriaUseCase implements UseCase<RemoverFotoGaleriaIn, GaleriaAtletaOut> {
  constructor(private readonly atletaRepository: AtletaRepository) {}

  async execute({ actor, url }: RemoverFotoGaleriaIn): Promise<GaleriaAtletaOut> {
    assertRole(actor, ["ATLETA"]);

    const atleta = await this.atletaRepository.findByUserId(actor.id);
    if (!atleta) throw new NotFoundError("Perfil de atleta não encontrado para este usuário.");

    const atualizado = atleta.clone({
      galeriaFotosUrls: atleta.galeriaFotosUrls.filter((fotoUrl) => fotoUrl !== url),
    });

    const salvo = await this.atletaRepository.update(atualizado);

    return { atleta: salvo };
  }
}
