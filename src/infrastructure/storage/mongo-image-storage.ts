import { ImageStoragePort, StoredImage } from "@/core/use-cases/_shared/image-storage.port";
import { AppError } from "@/infrastructure/errors";
import { ALLOWED_IMAGE_CONTENT_TYPES, MAX_IMAGE_BYTES } from "@/shared/constants/upload";
import { connectToDatabase } from "../database/mongoose";
import { ArquivoModel } from "../database/schemas/arquivo.schema";

export class MongoImageStorage implements ImageStoragePort {
  async save(buffer: Buffer, contentType: string, nomeOriginal?: string): Promise<StoredImage> {
    if (!ALLOWED_IMAGE_CONTENT_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number])) {
      throw new AppError(
        "Formato de imagem não suportado. Use JPEG, PNG ou WebP.",
        "UNSUPPORTED_IMAGE_TYPE",
        422,
      );
    }

    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      throw new AppError(
        `A imagem excede o limite de ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.`,
        "IMAGE_TOO_LARGE",
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
