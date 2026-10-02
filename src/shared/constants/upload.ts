export const ALLOWED_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/**
 * Limite por arquivo já comprimido. Guardamos os bytes direto num
 * documento do MongoDB (sem GridFS) porque o volume é pequeno (elenco de
 * até ~30 atletas + fotos moderadas do público) — o cluster Atlas M0 tem
 * 512MB de armazenamento total, então o upload no cliente sempre comprime
 * a imagem antes de enviar (ver src/shared/components/image-upload.tsx).
 */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/**
 * Comprovantes (nota fiscal/recibo) anexados a movimentações financeiras —
 * aceita PDF além de imagem, e um limite maior já que PDF não passa pela
 * compressão do lado do cliente.
 */
export const ALLOWED_ATTACHMENT_CONTENT_TYPES = [
  ...ALLOWED_IMAGE_CONTENT_TYPES,
  "application/pdf",
] as const;

export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
