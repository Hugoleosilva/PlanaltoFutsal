"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { compressImage } from "@/shared/utils/compress-image";
import { Button } from "@/shared/components/ui/button";

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onUploaded: (url: string) => void;
}

export function ImageUpload({ label, value, onUploaded }: ImageUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);

      const response = await fetch("/api/arquivos", { method: "POST", body: formData });
      const body = (await response.json()) as { url?: string; error?: { message: string } };

      if (!response.ok || !body.url) {
        throw new Error(body.error?.message ?? "Falha ao enviar imagem.");
      }

      onUploaded(body.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha ao enviar imagem.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label ? <span className="text-sm text-planalto-gray">{label}</span> : null}

      <div className="flex items-center gap-3">
        {value ? (
          <Image
            src={value}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover object-top"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-white/20 text-xs text-planalto-gray">
            sem foto
          </div>
        )}

        <Button
          type="button"
          variant="secondary"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Enviando..." : "Escolher imagem"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error ? <p className="text-xs text-planalto-red">{error}</p> : null}
    </div>
  );
}
