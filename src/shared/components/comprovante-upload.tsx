"use client";

import { useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ComprovanteUploadProps {
  value?: string | null;
  onUploaded: (url: string) => void;
  onRemover?: () => void;
}

export function ComprovanteUpload({
  value,
  onUploaded,
  onRemover,
}: ComprovanteUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/arquivos?tipo=documento", { method: "POST", body: formData });
      const body = (await response.json()) as { url?: string; error?: { message: string } };

      if (!response.ok || !body.url) {
        throw new Error(body.error?.message ?? "Falha ao enviar arquivo.");
      }

      onUploaded(body.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha ao enviar arquivo.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-surface/10 px-3 py-2 text-sm text-foreground hover:border-planalto-red"
        >
          <FileText size={16} />
          Ver comprovante anexado
        </a>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? "Enviando..." : value ? "Trocar arquivo" : "Anexar comprovante (Opcional)"}
      </Button>

      {value && onRemover ? (
        <button
          type="button"
          onClick={onRemover}
          aria-label="Remover comprovante"
          className="text-muted-foreground hover:text-planalto-red"
        >
          <X size={16} />
        </button>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {error ? <p className="text-xs text-planalto-red">{error}</p> : null}
    </div>
  );
}
