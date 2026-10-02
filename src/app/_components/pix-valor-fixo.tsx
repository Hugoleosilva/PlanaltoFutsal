"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check } from "lucide-react";
import { gerarPixCopiaCola } from "@/shared/utils/pix";
import { CHAVE_PIX, NOME_BENEFICIARIO_PIX, CIDADE_PIX } from "@/shared/constants/pix";
import { Button } from "@/shared/components/ui/button";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PixValorFixo({ valor }: { valor: number }): React.ReactElement {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const copiaECola = gerarPixCopiaCola({
    chave: CHAVE_PIX,
    nomeBeneficiario: NOME_BENEFICIARIO_PIX,
    cidade: CIDADE_PIX,
    valor,
  });

  useEffect(() => {
    QRCode.toDataURL(copiaECola, { width: 200, margin: 1 })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(null));
  }, [copiaECola]);

  async function handleCopiar(): Promise<void> {
    await navigator.clipboard.writeText(copiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-planalto-gray">
        Pix de <span className="font-semibold text-planalto-white">{formatBRL(valor)}</span>
      </p>
      {qrCodeUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrCodeUrl} alt="QR Code Pix" width={200} height={200} />
      ) : (
        <div className="flex h-[200px] w-[200px] items-center justify-center text-sm text-planalto-gray">
          Gerando QR Code...
        </div>
      )}
      <Button type="button" onClick={handleCopiar} variant="secondary">
        {copiado ? <Check size={16} /> : <Copy size={16} />}
        {copiado ? "Copiado!" : "Copiar código Pix"}
      </Button>
    </div>
  );
}
