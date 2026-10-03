import { MongoEnqueteRepository } from "@/infrastructure/database/repositories/engajamento.repository.mongo";
import {
  MongoFotoRepository,
  MongoTopicoGaleriaRepository,
} from "@/infrastructure/database/repositories/foto.repository.mongo";
import { MongoServicoRepository } from "@/infrastructure/database/repositories/servico.repository.mongo";
import { MongoPatrocinadorRepository } from "@/infrastructure/database/repositories/patrocinio-loja.repository.mongo";
import { ComunicadoForm } from "./comunicado-form";
import { EnqueteForm } from "./enquete-form";
import { PatrocinadorForm } from "./patrocinador-form";
import { ProdutoForm } from "./produto-form";
import { GaleriaForm } from "./galeria-form";
import { ServicoForm } from "./servico-form";

export default async function ConteudoPage(): Promise<React.ReactElement> {
  const [enqueteAtiva, topicos, fotosAprovadas, servicosAprovados, patrocinadores] = await Promise.all([
    new MongoEnqueteRepository().findAtiva(),
    new MongoTopicoGaleriaRepository().findAll(),
    new MongoFotoRepository().findByStatus("APROVADA"),
    new MongoServicoRepository().findByStatus("APROVADO"),
    new MongoPatrocinadorRepository().findAllAtivos(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Conteúdo do Site</h1>
        <p className="mt-1 text-muted-foreground">
          Mural de avisos, enquete, galeria, patrocinadores e loja exibidos no Portal Público.
        </p>
      </div>

      <div className="space-y-4">
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
        <GaleriaForm
          topicos={topicos.map((topico) => ({ id: topico.id, nome: topico.nome, categoria: topico.categoria }))}
          fotosAprovadas={fotosAprovadas.map((foto) => ({
            id: foto.id,
            url: foto.url,
            descricao: foto.descricao ?? "",
            destaque: foto.destaque,
            topicoId: foto.topicoId ?? null,
          }))}
        />
        <PatrocinadorForm
          patrocinadores={patrocinadores.map((patrocinador) => ({
            id: patrocinador.id,
            nome: patrocinador.nome,
            logoUrl: patrocinador.logoUrl,
            depoimento: patrocinador.depoimento,
            link: patrocinador.link,
            ordem: patrocinador.ordem,
            escala: patrocinador.escala,
          }))}
        />
        <ProdutoForm />
        <ServicoForm
          servicosAprovados={servicosAprovados.map((servico) => ({
            id: servico.id,
            titulo: servico.titulo,
            descricao: servico.descricao,
            imagensUrls: [...servico.imagensUrls],
            valores: servico.valores,
            formasPagamento: [...servico.formasPagamento],
            categoria: servico.categoria,
            bairro: servico.bairro,
            nomeContato: servico.nomeContato,
            contato: servico.contato,
          }))}
        />
      </div>
    </div>
  );
}
