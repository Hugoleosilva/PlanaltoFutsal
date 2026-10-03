import { MongoEnqueteRepository } from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { EnqueteVotoForm } from "./enquete-voto-form";
import { RadioPlayer } from "./radio-player";

export async function EngajamentoSection(): Promise<React.ReactElement> {
  const enquete = await new MongoEnqueteRepository().findAtiva();

  return (
    <section id="engajamento" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-foreground">
        Bem-vindos à casa do Planalto Futsal! Solta o som, fica à vontade e vem acompanhar o nosso time.
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="bg-black/40 backdrop-blur">
          <RadioPlayer />
        </Card>

        <Card className="bg-black/40 backdrop-blur">
          <h3 className="font-heading font-bold text-foreground">Enquete</h3>
          {enquete ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-foreground">{enquete.pergunta}</p>
              <EnqueteVotoForm enqueteId={enquete.id} opcoes={[...enquete.opcoes]} />
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Nenhuma enquete ativa agora.</p>
          )}
        </Card>
      </div>
    </section>
  );
}
