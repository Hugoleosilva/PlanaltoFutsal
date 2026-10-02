"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check } from "lucide-react";
import { gerarPixCopiaCola } from "@/shared/utils/pix";
import { Button } from "@/shared/components/ui/button";
import { CHAVE_PIX, NOME_BENEFICIARIO_PIX, CIDADE_PIX } from "@/shared/constants/pix";

export function PixSection(): React.ReactElement {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const copiaECola = gerarPixCopiaCola({
    chave: CHAVE_PIX,
    nomeBeneficiario: NOME_BENEFICIARIO_PIX,
    cidade: CIDADE_PIX,
  });

  useEffect(() => {
    QRCode.toDataURL(copiaECola, { width: 180, margin: 1 })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(null));
  }, [copiaECola]);

  async function handleCopiar(): Promise<void> {
    await navigator.clipboard.writeText(copiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <section id="apoie" className="text-center">
      <h2 className="font-heading text-3xl font-bold text-planalto-white">Apoie o Planalto Futsal</h2>
      <p className="mt-3 text-planalto-gray">
        Toda doação ajuda com uniformes, arbitragem e taxas de inscrição em campeonatos.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-card p-6">
        {qrCodeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrCodeUrl} alt="QR Code Pix" width={180} height={180} />
        ) : (
          <div className="flex h-[180px] w-[180px] items-center justify-center text-sm text-planalto-gray">
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
