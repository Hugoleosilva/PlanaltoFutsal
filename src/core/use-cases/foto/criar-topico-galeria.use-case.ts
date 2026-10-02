import { TopicoGaleria } from "@/core/domain/foto/topico-galeria.entity";
import { TopicoGaleriaRepository } from "@/core/domain/foto/topico-galeria.repository";
import { CategoriaFoto } from "@/core/domain/foto/foto.entity";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CriarTopicoGaleriaIn {
  actor: AuthenticatedActor;
  nome: string;
  categoria: CategoriaFoto;
}

export interface CriarTopicoGaleriaOut {
  topico: TopicoGaleria;
}

export class CriarTopicoGaleriaUseCase implements UseCase<CriarTopicoGaleriaIn, CriarTopicoGaleriaOut> {
  constructor(private readonly topicoRepository: TopicoGaleriaRepository) {}

  async execute(input: CriarTopicoGaleriaIn): Promise<CriarTopicoGaleriaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const topico = TopicoGaleria.create({
      nome: input.nome,
      categoria: input.categoria,
    });

    const salvo = await this.topicoRepository.create(topico);

    return { topico: salvo };
  }
}
