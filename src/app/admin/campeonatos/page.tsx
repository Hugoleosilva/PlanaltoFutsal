import { MongoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { MongoInscricaoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { CampeonatoForm } from "./campeonato-form";
import { CampeonatoAccordion } from "./campeonato-accordion";

export default async function CampeonatosPage(): Promise<React.ReactElement> {
  const [campeonatos, atletas] = await Promise.all([
    new MongoCampeonatoRepository().findAll(),
    new MongoAtletaRepository().findAllAtivos(),
  ]);

  const inscricaoRepository = new MongoInscricaoCampeonatoRepository();
  const atletaPorId = new Map(atletas.map((atleta) => [atleta.id, atleta]));

  const campeonatosComInscritos = await Promise.all(
    campeonatos.map(async (campeonato) => {
      const inscricoes = await inscricaoRepository.findByCampeonato(campeonato.id);

      const inscritos = inscricoes.map((inscricao) => ({
        atletaId: inscricao.atletaId,
        apelido: atletaPorId.get(inscricao.atletaId)?.apelido ?? "Atleta removido",
        categoria: inscricao.categoria,
      }));

      const idsInscritos = new Set(inscritos.map((inscrito) => inscrito.atletaId));
      const atletasDisponiveis = atletas
        .filter((atleta) => !idsInscritos.has(atleta.id))
        .map((atleta) => ({ id: atleta.id, apelido: atleta.apelido }));

      return { campeonato, inscritos, atletasDisponiveis };
    }),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Campeonatos</h1>
        <p className="mt-1 text-muted-foreground">{campeonatos.length} campeonato(s) cadastrado(s).</p>
      </div>

      <CampeonatoForm />

      {campeonatosComInscritos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum campeonato cadastrado ainda.</p>
      ) : (
        <div className="space-y-3">
          {campeonatosComInscritos.map(({ campeonato, inscritos, atletasDisponiveis }) => (
            <CampeonatoAccordion
              key={campeonato.id}
              campeonatoId={campeonato.id}
              nome={campeonato.nome}
              status={campeonato.status}
              taxaInscricao={campeonato.taxaInscricao ?? null}
              taxaArbitragem={campeonato.taxaArbitragem ?? null}
              inscritos={inscritos}
              atletasDisponiveis={atletasDisponiveis}
            />
          ))}
        </div>
      )}
    </div>
  );
}
