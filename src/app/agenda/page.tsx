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
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <AgendaSection />

          <details className="group mt-10 text-center" open={Boolean(params.mes || params.ano)}>
            <summary className="cursor-pointer list-none text-sm font-semibold text-planalto-red underline [&::-webkit-details-marker]:hidden">
              Ver resultados anteriores
            </summary>
            <div className="mt-6 text-left">
              <ResultadosSection mes={params.mes} ano={params.ano} />
            </div>
          </details>
        </div>
      </main>
      <PatrocinadoresSection />
      <PublicFooter />
    </>
  );
}
