import Image from "next/image";

function EscudoPlanalto({ tamanho }: { tamanho: number }): React.ReactElement {
  return (
    <Image
      src="/images/marca/escudo-planalto-futsal.png"
      alt="Planalto Futsal"
      width={tamanho}
      height={tamanho}
    />
  );
}

function EscudoAdversario({
  adversarioEscudoUrl,
  tamanho,
}: {
  adversarioEscudoUrl?: string | null;
  tamanho: number;
}): React.ReactElement {
  return adversarioEscudoUrl ? (
    <Image src={adversarioEscudoUrl} alt="" width={tamanho} height={tamanho} unoptimized />
  ) : (
    <div className="rounded-full bg-white/10" style={{ width: tamanho, height: tamanho }} />
  );
}

export function ConfrontoEscudos({
  adversarioEscudoUrl,
  mandante = "PLANALTO",
  tamanho = 32,
}: {
  adversarioEscudoUrl?: string | null;
  mandante?: "PLANALTO" | "ADVERSARIO";
  tamanho?: number;
}): React.ReactElement {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {mandante === "PLANALTO" ? (
        <>
          <EscudoPlanalto tamanho={tamanho} />
          <span className="text-xs text-planalto-gray">x</span>
          <EscudoAdversario adversarioEscudoUrl={adversarioEscudoUrl} tamanho={tamanho} />
        </>
      ) : (
        <>
          <EscudoAdversario adversarioEscudoUrl={adversarioEscudoUrl} tamanho={tamanho} />
          <span className="text-xs text-planalto-gray">x</span>
          <EscudoPlanalto tamanho={tamanho} />
        </>
      )}
    </div>
  );
}
