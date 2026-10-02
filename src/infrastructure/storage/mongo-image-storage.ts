import { ImageStoragePort, StoredImage } from "@/core/use-cases/_shared/image-storage.port";
import { AppError } from "@/infrastructure/errors";
import { ALLOWED_IMAGE_CONTENT_TYPES, MAX_IMAGE_BYTES } from "@/shared/constants/upload";
import { connectToDatabase } from "../database/mongoose";
import { ArquivoModel } from "../database/schemas/arquivo.schema";

export interface SaveArquivoOptions {
  allowedContentTypes?: readonly string[];
  maxBytes?: number;
}

export class MongoImageStorage implements ImageStoragePort {
  async save(
    buffer: Buffer,
    contentType: string,
    nomeOriginal?: string,
    options?: SaveArquivoOptions,
  ): Promise<StoredImage> {
    const allowedContentTypes = options?.allowedContentTypes ?? ALLOWED_IMAGE_CONTENT_TYPES;
    const maxBytes = options?.maxBytes ?? MAX_IMAGE_BYTES;

    if (!allowedContentTypes.includes(contentType)) {
      throw new AppError(
        "Formato de arquivo não suportado.",
        "UNSUPPORTED_FILE_TYPE",
        422,
      );
    }

    if (buffer.byteLength > maxBytes) {
      throw new AppError(
        `O arquivo excede o limite de ${Math.round(maxBytes / 1024 / 1024)}MB.`,
        "FILE_TOO_LARGE",
        422,
      );
    }

    await connectToDatabase();

    const created = await ArquivoModel.create({
      dados: buffer,
      contentType,
      tamanhoBytes: buffer.byteLength,
      nomeOriginal,
    });

    const id = created.id as string;

    return { id, url: `/api/arquivos/${id}` };
  }

  async delete(id: string): Promise<void> {
    await connectToDatabase();
    await ArquivoModel.findByIdAndDelete(id);
  }
}
