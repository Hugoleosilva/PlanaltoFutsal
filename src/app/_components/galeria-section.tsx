import {
  MongoFotoRepository,
  MongoTopicoGaleriaRepository,
} from "@/infrastructure/database/repositories/foto.repository.mongo";
import { GaleriaDestaques } from "./galeria-destaques";
import { TopicoGrid } from "./topico-grid";
import { Collapsible } from "@/shared/components/ui/collapsible";

const CATEGORIA_LABEL: Record<"ATUAL" | "ANTIGA", string> = {
  ATUAL: "Fotos Atuais",
  ANTIGA: "Das Antigas",
};

export async function GaleriaSection(): Promise<React.ReactElement> {
  const [fotos, topicos] = await Promise.all([
    new MongoFotoRepository().findByStatus("APROVADA"),
    new MongoTopicoGaleriaRepository().findAll(),
  ]);

  const fotosItem = fotos.map((foto) => ({
    id: foto.id,
    url: foto.url,
    descricao: foto.descricao,
    categoria: foto.categoria,
    topicoId: foto.topicoId ?? null,
    destaque: foto.destaque,
  }));

  const destaquesEscolhidos = fotosItem.filter((foto) => foto.destaque);
  const destaques = (destaquesEscolhidos.length > 0 ? destaquesEscolhidos : fotosItem).slice(0, 3);

  return (
    <section id="galeria" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-foreground">
        Galeria de Fotos
      </h2>
      {fotosItem.length > 0 ? (
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Clique numa categoria pra ver os tópicos, e numa foto pra abrir com a descrição.
        </p>
      ) : null}

      {fotosItem.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Em breve, fotos do time e da torcida por aqui.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {destaques.length > 0 ? <GaleriaDestaques fotos={destaques} /> : null}

          {(["ATUAL", "ANTIGA"] as const).map((categoria) => {
            const fotosDaCategoria = fotosItem.filter((foto) => foto.categoria === categoria);
            if (fotosDaCategoria.length === 0) return null;

            const topicosComFotos = topicos
              .filter((topico) => topico.categoria === categoria)
              .map((topico) => ({
                id: topico.id,
                nome: topico.nome,
                fotos: fotosDaCategoria.filter((foto) => foto.topicoId === topico.id),
              }))
              .filter((topico) => topico.fotos.length > 0);

            const fotosSemTopico = fotosDaCategoria.filter((foto) => !foto.topicoId);

            return (
              <Collapsible key={categoria} titulo={CATEGORIA_LABEL[categoria]}>
                <div className="space-y-4">
                  {topicosComFotos.map((topico) => (
                    <Collapsible key={topico.id} titulo={topico.nome}>
                      <TopicoGrid fotos={topico.fotos} />
                    </Collapsible>
                  ))}

                  {fotosSemTopico.length > 0 ? (
                    <Collapsible titulo="Outras fotos">
                      <TopicoGrid fotos={fotosSemTopico} />
                    </Collapsible>
                  ) : null}
                </div>
              </Collapsible>
            );
          })}
        </div>
      )}
    </section>
  );
}
