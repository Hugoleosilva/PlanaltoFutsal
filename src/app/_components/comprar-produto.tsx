"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, MessageCircle } from "lucide-react";
import { gerarPixCopiaCola } from "@/shared/utils/pix";
import { CHAVE_PIX, NOME_BENEFICIARIO_PIX, CIDADE_PIX } from "@/shared/constants/pix";
import { Button } from "@/shared/components/ui/button";

export interface DiretorContato {
  nome: string;
  contato: string;
}

function linkWhatsappDiretor(contato: string, nomeProduto: string): string {
  const digitos = contato.replace(/\D/g, "");
  const mensagem = encodeURIComponent(`Olá! Tenho interesse em comprar: ${nomeProduto}`);
  return `https://wa.me/55${digitos}?text=${mensagem}`;
}

export function ComprarProduto({
  nomeProduto,
  preco,
  diretores,
}: {
  nomeProduto: string;
  preco: number;
  diretores: DiretorContato[];
}): React.ReactElement {
  const [modo, setModo] = useState<"nenhum" | "whatsapp" | "pix">("nenhum");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const copiaECola = gerarPixCopiaCola({
    chave: CHAVE_PIX,
    nomeBeneficiario: NOME_BENEFICIARIO_PIX,
    cidade: CIDADE_PIX,
    valor: preco,
  });

  useEffect(() => {
    if (modo !== "pix") return;
    QRCode.toDataURL(copiaECola, { width: 180, margin: 1 })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(null));
  }, [modo, copiaECola]);

  async function handleCopiar(): Promise<void> {
    await navigator.clipboard.writeText(copiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        {diretores.length > 0 ? (
          <Button
            variant={modo === "whatsapp" ? "primary" : "secondary"}
            className="flex-1"
            onClick={() => setModo((prev) => (prev === "whatsapp" ? "nenhum" : "whatsapp"))}
          >
            <MessageCircle size={14} /> Falar com a diretoria
          </Button>
        ) : null}
        <Button
          variant={modo === "pix" ? "primary" : "secondary"}
          className="flex-1"
          onClick={() => setModo((prev) => (prev === "pix" ? "nenhum" : "pix"))}
        >
          Gerar Pix
        </Button>
      </div>

      {modo === "whatsapp" ? (
        <div className="space-y-1.5 rounded-md bg-black/20 p-2">
          {diretores.map((diretor) => (
            <a
              key={diretor.nome}
              href={linkWhatsappDiretor(diretor.contato, nomeProduto)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md bg-white/10 px-2.5 py-1.5 text-center text-xs font-semibold text-white hover:bg-white/20"
            >
              {diretor.nome}
            </a>
          ))}
        </div>
      ) : null}

      {modo === "pix" ? (
        <div className="flex flex-col items-center gap-2 rounded-md bg-black/20 p-3">
          {qrCodeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrCodeUrl} alt="QR Code Pix" width={160} height={160} />
          ) : (
            <div className="flex h-[160px] w-[160px] items-center justify-center text-xs text-planalto-gray">
              Gerando QR Code...
            </div>
          )}
          <button
            type="button"
            onClick={handleCopiar}
            className="flex items-center gap-1.5 text-xs font-semibold text-planalto-white underline"
          >
            {copiado ? <Check size={14} /> : <Copy size={14} />}
            {copiado ? "Copiado!" : "Copiar código Pix"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
