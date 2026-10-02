import Image from "next/image";
import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { Badge } from "@/shared/components/ui/badge";

const FORMA_LABEL: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO: "Cartão",
};

export async function ServicosLista(): Promise<React.ReactElement> {
  const servicos = await new MongoServicoRepository().findByStatus("APROVADO");

  if (servicos.length === 0) {
    return (
      <p className="text-center text-sm text-planalto-gray">
        Nenhum serviço divulgado ainda. Seja o primeiro!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {servicos.map((servico) => (
        <div key={servico.id} className="overflow-hidden rounded-lg border border-white/10 bg-card p-4">
          <div className="flex justify-center gap-2">
            {servico.imagensUrls.map((url, index) => (
              <div
                key={url}
                className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-md bg-black/40"
              >
                <Image
                  src={url}
                  alt={`${servico.titulo} ${index + 1}`}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <p className="mt-3 text-center font-heading font-bold text-planalto-white">
            {servico.titulo} — {servico.nomeContato}
          </p>

          <p className="mt-2 text-center text-sm text-planalto-gray">{servico.descricao}</p>

          {servico.valores ? (
            <p className="mt-2 text-center text-sm text-planalto-red">{servico.valores}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {servico.formasPagamento.map((forma) => (
              <Badge key={forma}>{FORMA_LABEL[forma] ?? forma}</Badge>
            ))}
          </div>

          <p className="mt-3 rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold text-white">
            Agende seu Orçamento:{" "}
            <span className="whitespace-nowrap">
              {servico.contato} ({servico.nomeContato})
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
