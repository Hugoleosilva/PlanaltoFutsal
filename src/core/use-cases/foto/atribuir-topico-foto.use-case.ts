import { Foto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { TopicoGaleriaRepository } from "@/core/domain/foto/topico-galeria.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { NotFoundError } from "@/infrastructure/errors";

export interface AtribuirTopicoFotoIn {
  actor: AuthenticatedActor;
  fotoId: string;
  topicoId: string;
  descricao?: string;
}

export interface AtribuirTopicoFotoOut {
  foto: Foto;
}

/**
 * Move uma foto solta (sem tópico) pra dentro de um tópico já existente —
 * a categoria da foto passa a acompanhar a do tópico escolhido.
 */
export class AtribuirTopicoFotoUseCase implements UseCase<AtribuirTopicoFotoIn, AtribuirTopicoFotoOut> {
  constructor(
    private readonly fotoRepository: FotoRepository,
    private readonly topicoRepository: TopicoGaleriaRepository,
  ) {}

  async execute(input: AtribuirTopicoFotoIn): Promise<AtribuirTopicoFotoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const foto = await this.fotoRepository.findById(input.fotoId);
    if (!foto) throw new NotFoundError("Foto não encontrada.");

    const topico = await this.topicoRepository.findById(input.topicoId);
    if (!topico) throw new NotFoundError("Tópico não encontrado.");

    const atualizada = await this.fotoRepository.update(
      foto.clone({
        topicoId: topico.id,
        categoria: topico.categoria,
        descricao: input.descricao !== undefined ? input.descricao : foto.descricao,
      }),
    );

    return { foto: atualizada };
  }
}
