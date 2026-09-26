"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check } from "lucide-react";
import { gerarPixCopiaCola } from "@/shared/utils/pix";
import { Button } from "@/shared/components/ui/button";

const CHAVE_PIX = "planaltofutsal2025@gmail.com";

export function PixSection(): React.ReactElement {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const copiaECola = gerarPixCopiaCola({
    chave: CHAVE_PIX,
    nomeBeneficiario: "Planalto Futsal",
    cidade: "Recife",
  });

  useEffect(() => {
    QRCode.toDataURL(copiaECola, { width: 240, margin: 1 })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(null));
  }, [copiaECola]);

  async function handleCopiar(): Promise<void> {
    await navigator.clipboard.writeText(copiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <section id="apoie" className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h2 className="font-heading text-3xl font-bold text-planalto-white">Apoie o Planalto Futsal</h2>
      <p className="mt-3 text-planalto-gray">
        Toda doação ajuda com uniformes, arbitragem e taxas de inscrição em campeonatos.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-card p-8">
        {qrCodeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrCodeUrl} alt="QR Code Pix" width={240} height={240} />
        ) : (
          <div className="flex h-[240px] w-[240px] items-center justify-center text-sm text-planalto-gray">
            Gerando QR Code...
          </div>
        )}

        <p className="text-sm text-planalto-gray">
          Chave Pix: <span className="text-planalto-white">{CHAVE_PIX}</span>
        </p>

        <Button onClick={handleCopiar} variant="secondary">
          {copiado ? <Check size={16} /> : <Copy size={16} />}
          {copiado ? "Copiado!" : "Copiar código Pix"}
        </Button>
      </div>
    </section>
  );
}
