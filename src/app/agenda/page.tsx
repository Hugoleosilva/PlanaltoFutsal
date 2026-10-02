import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { AgendaSection } from "../_components/agenda-section";
import { ResultadosSection } from "../_components/resultados-section";
import { PatrocinadoresSection } from "../_components/patrocinadores-section";
import { PublicFooter } from "../_components/public-footer";

interface AgendaPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

export default async function AgendaPage({ searchParams }: AgendaPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <AgendaSection />
        <ResultadosSection mes={params.mes} ano={params.ano} />
      </main>
      <PatrocinadoresSection />
      <PublicFooter />
    </>
  );
}
