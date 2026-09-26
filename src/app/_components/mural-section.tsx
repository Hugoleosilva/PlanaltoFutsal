import { MongoComunicadoRepository } from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

function formatData(data: Date): string {
  return data.toLocaleDateString("pt-BR");
}

export async function MuralSection(): Promise<React.ReactElement> {
  const comunicados = await new MongoComunicadoRepository().findRecentes(10);

  if (comunicados.length === 0) return <></>;

  return (
    <section id="mural" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">
        Mural de Avisos
      </h2>

      <div className="mt-8 space-y-3">
        {comunicados.map((comunicado) => (
          <Card key={comunicado.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-planalto-white">{comunicado.titulo}</p>
              <div className="flex items-center gap-2">
                {comunicado.fixado ? <Badge tone="warning">Fixado</Badge> : null}
                <span className="text-xs text-planalto-gray">{formatData(comunicado.publicadoEm)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-planalto-gray">{comunicado.corpo}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
