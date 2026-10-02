"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, QrCode } from "lucide-react";
import { gerarPixCopiaCola } from "@/shared/utils/pix";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
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
    <Card id="apoie" className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
      <div className="flex items-center gap-2 text-planalto-red">
        <QrCode size={22} />
        <p className="font-heading text-lg font-bold text-planalto-white">Pix Avulso</p>
      </div>

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
    </Card>
  );
}
