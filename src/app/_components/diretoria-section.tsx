import { MongoMembroDiretoriaRepository } from "@/infrastructure/database/repositories/membro-diretoria.repository.mongo";
import { DiretoriaGrid } from "./diretoria-grid";

export async function DiretoriaSection(): Promise<React.ReactElement> {
  const membros = await new MongoMembroDiretoriaRepository().findAllAtivos();

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-0">
      <h2 className="text-center font-heading text-3xl font-bold text-planalto-white">Diretoria</h2>
      <p className="mx-auto mt-2 text-center text-planalto-gray">
        Saiba quem toca o Planalto Futsal fora das quatro linhas — conheça um pouco de quem faz esse
        Projeto acontecer.
      </p>

      {membros.length === 0 ? (
        <p className="mt-8 text-center text-sm text-planalto-gray">
          Em breve, os responsáveis pelo clube por aqui.
        </p>
      ) : (
        <DiretoriaGrid
          membros={membros.map((membro) => ({
            id: membro.id,
            nome: membro.nome,
            funcao: membro.funcao,
            fotoUrl: membro.fotoUrl,
            bio: membro.bio,
          }))}
        />
      )}
    </section>
  );
}
