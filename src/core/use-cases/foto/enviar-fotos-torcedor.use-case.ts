import { randomUUID } from "node:crypto";
import { Foto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";
import { AppError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";

const MAX_FOTOS_POR_ENVIO = 5;

export interface FotoParaEnvio {
  url: string;
  descricao?: string;
  categoria: "ANTIGA" | "ATUAL";
}

export interface EnviarFotosTorcedorIn {
  fotos: FotoParaEnvio[];
  enviadoPorNome?: string;
  enviadoPorContato?: string;
}

export interface EnviarFotosTorcedorOut {
  fotos: Foto[];
}

export class EnviarFotosTorcedorUseCase
  implements UseCase<EnviarFotosTorcedorIn, EnviarFotosTorcedorOut>
{
  constructor(private readonly fotoRepository: FotoRepository) {}

  async execute({
    fotos,
    enviadoPorNome,
    enviadoPorContato,
  }: EnviarFotosTorcedorIn): Promise<EnviarFotosTorcedorOut> {
    if (fotos.length === 0 || fotos.length > MAX_FOTOS_POR_ENVIO) {
      throw new AppError(
        `Envie entre 1 e ${MAX_FOTOS_POR_ENVIO} fotos por vez.`,
        "MAX_FOTOS_POR_ENVIO_EXCEDIDO",
        422,
      );
    }

    const loteEnvioId = randomUUID();

    const fotosCriadas = fotos.map((foto) =>
      Foto.create({
        url: foto.url,
        descricao: foto.descricao,
        categoria: foto.categoria,
        status: "PENDENTE_APROVACAO",
        enviadoPorNome,
        enviadoPorContato,
        loteEnvioId,
      }),
    );

    const salvas = await this.fotoRepository.createMany(fotosCriadas);

    return { fotos: salvas };
  }
}
