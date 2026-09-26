export const ALLOWED_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/**
 * Limite por arquivo já comprimido. Guardamos os bytes direto num
 * documento do MongoDB (sem GridFS) porque o volume é pequeno (elenco de
 * até ~30 atletas + fotos moderadas do público) — o cluster Atlas M0 tem
 * 512MB de armazenamento total, então o upload no cliente sempre comprime
 * a imagem antes de enviar (ver src/shared/components/image-upload.tsx).
 */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
