import { MongoMembroDiretoriaRepository } from "@/infrastructure/database/repositories/membro-diretoria.repository.mongo";
import { DiretoriaGrid } from "./diretoria-grid";

export async function DiretoriaSection(): Promise<React.ReactElement> {
  const membros = await new MongoMembroDiretoriaRepository().findAllAtivos();

  return (
    <section className="mx-auto max-w-5xl px-6 pb-6 pt-0">
      <div className="mx-auto w-fit max-w-xl rounded-lg bg-card px-6 py-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground">Diretoria</h2>
        <p className="mt-2 text-muted-foreground">
          Saiba quem toca o Planalto Futsal fora das quatro linhas — conheça um pouco de quem faz esse
          Projeto acontecer.
        </p>
      </div>

      {membros.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
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
