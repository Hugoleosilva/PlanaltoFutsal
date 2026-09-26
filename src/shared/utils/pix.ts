interface PixPayloadInput {
  chave: string;
  nomeBeneficiario: string;
  cidade: string;
  valor?: number;
  identificador?: string;
}

function campo(id: string, valor: string): string {
  return `${id}${valor.length.toString().padStart(2, "0")}${valor}`;
}

function removerAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function crc16(payload: string): string {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Gera o payload Pix "copia e cola" (padrão EMV/BR Code do Bacen), sem
 * depender de nenhuma API externa — só precisa da chave Pix.
 */
export function gerarPixCopiaCola({
  chave,
  nomeBeneficiario,
  cidade,
  valor,
  identificador = "***",
}: PixPayloadInput): string {
  const nome = removerAcentos(nomeBeneficiario).slice(0, 25).toUpperCase();
  const cidadeFormatada = removerAcentos(cidade).slice(0, 15).toUpperCase();

  const merchantAccountInfo = campo("00", "br.gov.bcb.pix") + campo("01", chave);

  const partes = [
    campo("00", "01"),
    campo("26", merchantAccountInfo),
    campo("52", "0000"),
    campo("53", "986"),
    ...(valor ? [campo("54", valor.toFixed(2))] : []),
    campo("58", "BR"),
    campo("59", nome),
    campo("60", cidadeFormatada),
    campo("62", campo("05", identificador)),
  ];

  const payloadSemCrc = `${partes.join("")}6304`;

  return `${payloadSemCrc}${crc16(payloadSemCrc)}`;
}
