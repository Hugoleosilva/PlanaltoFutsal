const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/**
 * Redimensiona/comprime a imagem no navegador antes do upload, para caber
 * confortavelmente no limite de MAX_IMAGE_BYTES e poupar espaço no cluster
 * MongoDB Atlas M0 (512MB no total).
 *
 * PNG/WebP viram PNG (sem perda, preserva transparência — importante pra
 * escudos/logos sem fundo). Os demais viram JPEG (bem mais leve, mas sem
 * canal alfa — se saísse JPEG aqui, qualquer PNG transparente ganharia um
 * fundo preto sólido nessa conversão).
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(bitmap, 0, 0, width, height);

  const preservarTransparencia = file.type === "image/png" || file.type === "image/webp";
  const tipoSaida = preservarTransparencia ? "image/png" : "image/jpeg";
  const extensaoSaida = preservarTransparencia ? ".png" : ".jpg";

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, tipoSaida, preservarTransparencia ? undefined : JPEG_QUALITY),
  );

  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + extensaoSaida;
  return new File([blob], newName, { type: tipoSaida });
}
