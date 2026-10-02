import { randomUUID } from "node:crypto";
import { Foto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { TopicoGaleriaRepository } from "@/core/domain/foto/topico-galeria.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { AppError, NotFoundError } from "@/infrastructure/errors";

const MAX_FOTOS_POR_ENVIO = 5;

export interface FotoParaPublicar {
  url: string;
  descricao?: string;
}

export interface PublicarFotoGaleriaIn {
  actor: AuthenticatedActor;
  topicoId: string;
  fotos: FotoParaPublicar[];
}

export interface PublicarFotoGaleriaOut {
  fotos: Foto[];
}

/**
 * Fotos publicadas direto pela diretoria já nascem aprovadas — diferente do
 * envio do torcedor, que fica pendente até alguém moderar. A categoria
 * (Atuais/Das Antigas) vem sempre do tópico escolhido, nunca é escolhida à
 * parte, pra não deixar foto e tópico em categorias diferentes.
 */
export class PublicarFotoGaleriaUseCase implements UseCase<PublicarFotoGaleriaIn, PublicarFotoGaleriaOut> {
  constructor(
    private readonly fotoRepository: FotoRepository,
    private readonly topicoRepository: TopicoGaleriaRepository,
  ) {}

  async execute(input: PublicarFotoGaleriaIn): Promise<PublicarFotoGaleriaOut> {
    assertRole(input.actor, ["ADMIN"]);

    if (input.fotos.length === 0 || input.fotos.length > MAX_FOTOS_POR_ENVIO) {
      throw new AppError(
        `Envie entre 1 e ${MAX_FOTOS_POR_ENVIO} fotos por vez.`,
        "MAX_FOTOS_POR_ENVIO_EXCEDIDO",
        422,
      );
    }

    const topico = await this.topicoRepository.findById(input.topicoId);
    if (!topico) throw new NotFoundError("Tópico não encontrado.");

    const loteEnvioId = randomUUID();
    const agora = new Date();

    const fotosCriadas = input.fotos.map((foto) =>
      Foto.create({
        url: foto.url,
        descricao: foto.descricao,
        categoria: topico.categoria,
        topicoId: topico.id,
        status: "APROVADA",
        loteEnvioId,
        moderadoPorUserId: input.actor.id,
        moderadoEm: agora,
      }),
    );

    const salvas = await this.fotoRepository.createMany(fotosCriadas);

    return { fotos: salvas };
  }
}
