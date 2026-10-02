import { auth } from "@/infrastructure/security/auth";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoContribuicaoSocioRepository } from "@/infrastructure/database/repositories/contribuicao-socio.repository.mongo";
import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { PixSection } from "../_components/pix-section";
import { SocioCta } from "../_components/socio-cta";

export default async function ApoiePage(): Promise<React.ReactElement> {
  const session = await auth();

  let jaEhSocio = false;
  let planoAtual: { tipo: "MENSAL" | "UNICO"; valor: number; diaVencimento?: number | null } | null = null;
  let contribuicaoPendenteValor: number | null = null;

  if (session?.user?.id) {
    const user = await new MongoUserRepository().findById(session.user.id);
    jaEhSocio = user?.isSocio ?? false;

    if (jaEhSocio && user?.socioTipoPlano) {
      planoAtual = {
        tipo: user.socioTipoPlano,
        valor: user.socioValorPlano ?? 0,
        diaVencimento: user.socioDiaVencimento,
      };

      const pendente = await new MongoContribuicaoSocioRepository().findPendentePorUsuario(user.id);
      contribuicaoPendenteValor = pendente?.valor ?? null;
    }
  }

  return (
    <QuadraBackdrop semRolagem>
      <PublicNav />
      <main className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-6 py-3">
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-planalto-white">
              Apoie o Planalto Futsal
            </h1>
            <p className="mx-auto mt-1 max-w-xl text-sm text-planalto-gray">
              Toda doação ajuda com uniformes, arbitragem e taxas de inscrição em campeonatos — faça um
              Pix avulso ou vire sócio Planalto Meu Amor!
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
            <PixSection />
            <SocioCta
              logado={Boolean(session?.user)}
              jaEhSocio={jaEhSocio}
              planoAtual={planoAtual}
              contribuicaoPendenteValor={contribuicaoPendenteValor}
            />
          </div>
        </div>
      </main>
    </QuadraBackdrop>
  );
}
