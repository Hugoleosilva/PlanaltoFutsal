"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ImageUpload } from "@/shared/components/image-upload";
import { Card } from "@/shared/components/ui/card";
import { adicionarFotoGaleriaAction, atualizarFotoPrincipalAction, removerFotoGaleriaAction } from "./actions";

const MAX_FOTOS_GALERIA = 4;

interface GaleriaManagerProps {
  fotoPrincipalUrl: string | null;
  galeriaFotosUrls: string[];
}

export function GaleriaManager({
  fotoPrincipalUrl,
  galeriaFotosUrls,
}: GaleriaManagerProps): React.ReactElement {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotoPrincipalUrl);
  const [galeria, setGaleria] = useState(galeriaFotosUrls);
  const [error, setError] = useState<string | null>(null);

  async function handlePrincipalUploaded(url: string): Promise<void> {
    setFotoPrincipal(url);
    await atualizarFotoPrincipalAction(url);
  }

  async function handleGaleriaUploaded(url: string): Promise<void> {
    const resultado = await adicionarFotoGaleriaAction(url);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setError(null);
    setGaleria((prev) => [...prev, url]);
  }

  async function handleRemover(url: string): Promise<void> {
    setGaleria((prev) => prev.filter((item) => item !== url));
    await removerFotoGaleriaAction(url);
  }

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-planalto-white">Fotos</h2>
        <p className="mt-1 text-xs text-planalto-gray">
          Foto principal + até {MAX_FOTOS_GALERIA} fotos jogando.
        </p>
      </div>

      <ImageUpload label="Foto principal" value={fotoPrincipal} onUploaded={handlePrincipalUploaded} />

      <div>
        <p className="mb-2 text-sm text-planalto-gray">
          Galeria ({galeria.length}/{MAX_FOTOS_GALERIA})
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {galeria.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md">
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => handleRemover(url)}
                aria-label="Remover foto"
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-planalto-red"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {galeria.length < MAX_FOTOS_GALERIA ? (
          <div className="mt-3">
            <ImageUpload label="Adicionar foto jogando" onUploaded={handleGaleriaUploaded} />
          </div>
        ) : null}

        {error ? <p className="mt-2 text-xs text-planalto-red">{error}</p> : null}
      </div>
    </Card>
  );
}
