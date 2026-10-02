import { auth } from "@/infrastructure/security/auth";
import { MongoUserRepository } from "@/infrastructure/database/repositories/user.repository.mongo";
import { MongoContribuicaoSocioRepository } from "@/infrastructure/database/repositories/contribuicao-socio.repository.mongo";
import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { PixSection } from "../_components/pix-section";
import { SocioCta } from "../_components/socio-cta";
import { PublicFooter } from "../_components/public-footer";

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
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          <PixSection />
          <SocioCta
            logado={Boolean(session?.user)}
            jaEhSocio={jaEhSocio}
            planoAtual={planoAtual}
            contribuicaoPendenteValor={contribuicaoPendenteValor}
          />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
