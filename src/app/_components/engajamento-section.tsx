import { Radio } from "lucide-react";
import { MongoEnqueteRepository } from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { EnqueteVotoForm } from "./enquete-voto-form";

export async function EngajamentoSection(): Promise<React.ReactElement> {
  const enquete = await new MongoEnqueteRepository().findAtiva();

  return (
    <section id="engajamento" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Rádio & Enquete
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-planalto-white">
            <Radio size={18} />
            <h3 className="font-heading font-bold">Web Rádio</h3>
          </div>
          <p className="mt-2 text-sm text-planalto-gray">Em breve, rádio parceira 24h por aqui.</p>
        </Card>

        <Card>
          <h3 className="font-heading font-bold text-planalto-white">Enquete</h3>
          {enquete ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-planalto-white">{enquete.pergunta}</p>
              <EnqueteVotoForm enqueteId={enquete.id} opcoes={[...enquete.opcoes]} />
            </div>
          ) : (
            <p className="mt-2 text-sm text-planalto-gray">Nenhuma enquete ativa agora.</p>
          )}
        </Card>
      </div>
    </section>
  );
}
