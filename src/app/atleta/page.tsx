import Image from "next/image";
import { auth } from "@/infrastructure/security/auth";
import { MongoAtletaRepository } from "@/infrastructure/database/repositories/atleta.repository.mongo";
import { MongoInscricaoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { MongoCampeonatoRepository } from "@/infrastructure/database/repositories/campeonato.repository.mongo";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { PerfilForm } from "./perfil-form";
import { GaleriaManager } from "./galeria-manager";

export default async function AtletaDashboardPage(): Promise<React.ReactElement> {
  const session = await auth();
  const atleta = session?.user
    ? await new MongoAtletaRepository().findByUserId(session.user.id)
    : null;

  if (!atleta) {
    return (
      <div className="p-8">
        <Card>
          <p className="text-foreground">
            Seu login ainda não está vinculado a um perfil de atleta.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Fale com a diretoria para vincularem seu acesso ao seu cadastro.
          </p>
        </Card>
      </div>
    );
  }

  const inscricoes = await new MongoInscricaoCampeonatoRepository().findByAtleta(atleta.id);
  const campeonatoRepository = new MongoCampeonatoRepository();

  const campeonatos = await Promise.all(
    inscricoes.map(async (inscricao) => {
      const campeonato = await campeonatoRepository.findById(inscricao.campeonatoId);
      return campeonato ? { campeonato, categoria: inscricao.categoria } : null;
    }),
  );

  const campeonatosAtivos = campeonatos
    .filter((item) => item !== null)
    .filter((item) => item.campeonato.status !== "ENCERRADO");

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      <div className="flex items-center gap-4">
        {atleta.fotoPrincipalUrl ? (
          <Image
            src={atleta.fotoPrincipalUrl}
            alt=""
            width={72}
            height={72}
            className="h-18 w-18 rounded-full object-cover object-top"
            unoptimized
          />
        ) : null}

        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{atleta.apelido}</h1>
          <p className="text-muted-foreground">
            {atleta.nomeCompleto} · {atleta.idade} anos
          </p>
        </div>
      </div>

      <PerfilForm
        apelido={atleta.apelido}
        bio={atleta.bio}
        posicao={atleta.posicao ?? null}
        estiloDeJogo={atleta.estiloDeJogo}
        preferencias={atleta.preferencias}
      />

      <GaleriaManager
        fotoPrincipalUrl={atleta.fotoPrincipalUrl ?? null}
        galeriaFotosUrls={[...atleta.galeriaFotosUrls]}
      />

      <Card>
        <h2 className="font-heading text-lg font-bold text-foreground">
          Campeonatos em disputa
        </h2>

        {campeonatosAtivos.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Você ainda não está vinculado a nenhum campeonato ativo.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {campeonatosAtivos.map(({ campeonato, categoria }) => (
              <li
                key={campeonato.id}
                className="flex items-center justify-between rounded-md border border-surface/10 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{campeonato.nome}</p>
                  {categoria ? <p className="text-xs text-muted-foreground">{categoria}</p> : null}
                </div>
                <Badge>{campeonato.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
