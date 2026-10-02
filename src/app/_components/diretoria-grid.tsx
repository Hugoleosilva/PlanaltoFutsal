import { MembroDiretoriaCard } from "./membro-diretoria-card";

interface MembroItem {
  id: string;
  nome: string;
  funcao: string;
  fotoUrl?: string | null;
  bio?: string;
}

export function DiretoriaGrid({ membros }: { membros: MembroItem[] }): React.ReactElement {
  return (
    <div className="mt-5 grid grid-cols-6 items-stretch gap-4">
      {membros.map((membro) => (
        <MembroDiretoriaCard
          key={membro.id}
          nome={membro.nome}
          funcao={membro.funcao}
          fotoUrl={membro.fotoUrl}
          bio={membro.bio}
        />
      ))}
    </div>
  );
}
