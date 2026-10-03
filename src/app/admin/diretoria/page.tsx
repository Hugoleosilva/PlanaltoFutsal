import { MongoMembroDiretoriaRepository } from "@/infrastructure/database/repositories/membro-diretoria.repository.mongo";
import { MembroForm } from "./membro-form";
import { MembroCard } from "./membro-card";

export default async function DiretoriaAdminPage(): Promise<React.ReactElement> {
  const membros = await new MongoMembroDiretoriaRepository().findAllAtivos();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Diretoria</h1>
        <p className="mt-1 text-muted-foreground">{membros.length} membro(s) cadastrado(s).</p>
      </div>

      <MembroForm />

      {membros.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum membro cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {membros.map((membro) => (
            <MembroCard
              key={membro.id}
              id={membro.id}
              nome={membro.nome}
              funcao={membro.funcao}
              fotoUrl={membro.fotoUrl ?? null}
              bio={membro.bio ?? ""}
              ordem={membro.ordem}
              contato={membro.contato}
            />
          ))}
        </div>
      )}
    </div>
  );
}
