import { Foto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { AppError, NotFoundError } from "@/infrastructure/errors";

const MAX_DESTAQUES = 3;

export interface MarcarFotoDestaqueIn {
  actor: AuthenticatedActor;
  fotoId: string;
  destaque: boolean;
}

export interface MarcarFotoDestaqueOut {
  foto: Foto;
}

/**
 * As 3 fotos em destaque no topo da galeria pública são escolhidas à mão
 * pela diretoria — no máximo 3 ao mesmo tempo.
 */
export class MarcarFotoDestaqueUseCase implements UseCase<MarcarFotoDestaqueIn, MarcarFotoDestaqueOut> {
  constructor(private readonly fotoRepository: FotoRepository) {}

  async execute(input: MarcarFotoDestaqueIn): Promise<MarcarFotoDestaqueOut> {
    assertRole(input.actor, ["ADMIN"]);

    const foto = await this.fotoRepository.findById(input.fotoId);
    if (!foto) throw new NotFoundError("Foto não encontrada.");

    if (input.destaque && !foto.destaque) {
      const destaquesAtuais = await this.fotoRepository.findByStatus("APROVADA");
      const totalDestaques = destaquesAtuais.filter((item) => item.destaque).length;
      if (totalDestaques >= MAX_DESTAQUES) {
        throw new AppError(
          `Só pode ter ${MAX_DESTAQUES} fotos em destaque ao mesmo tempo. Remova uma antes de adicionar outra.`,
          "MAX_DESTAQUES_ATINGIDO",
          422,
        );
      }
    }

    const atualizada = await this.fotoRepository.update(foto.marcarDestaque(input.destaque));

    return { foto: atualizada };
  }
}
