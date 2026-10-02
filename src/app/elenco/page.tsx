import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { ElencoSection } from "../_components/elenco-section";
import { PublicFooter } from "../_components/public-footer";

interface ElencoPublicoPageProps {
  searchParams: Promise<{ campeonato?: string }>;
}

export default async function ElencoPublicoPage({
  searchParams,
}: ElencoPublicoPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <ElencoSection campeonatoFiltro={params.campeonato} />
      </main>
      <PublicFooter />
    </>
  );
}
