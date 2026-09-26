import { MongoEnqueteRepository } from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import { ComunicadoForm } from "./comunicado-form";
import { EnqueteForm } from "./enquete-form";
import { PatrocinadorForm } from "./patrocinador-form";
import { ProdutoForm } from "./produto-form";

export default async function ConteudoPage(): Promise<React.ReactElement> {
  const enqueteAtiva = await new MongoEnqueteRepository().findAtiva();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-planalto-white">Conteúdo do Site</h1>
        <p className="mt-1 text-planalto-gray">
          Mural de avisos, enquete, patrocinadores e loja exibidos no Portal Público.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ComunicadoForm />
        <EnqueteForm
          enqueteAtiva={
            enqueteAtiva
              ? {
                  id: enqueteAtiva.id,
                  pergunta: enqueteAtiva.pergunta,
                  opcoes: [...enqueteAtiva.opcoes],
                }
              : null
          }
        />
        <PatrocinadorForm />
        <ProdutoForm />
      </div>
    </div>
  );
}
