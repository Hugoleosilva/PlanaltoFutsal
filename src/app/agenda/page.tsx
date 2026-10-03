import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { AgendaSection } from "../_components/agenda-section";
import { ResultadosSection } from "../_components/resultados-section";

interface AgendaPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

export default async function AgendaPage({ searchParams }: AgendaPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <AgendaSection />

          <details className="group mt-10 text-center" open={Boolean(params.mes || params.ano)}>
            <summary className="mx-auto inline-block w-fit cursor-pointer list-none rounded-md bg-card px-4 py-2 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              Ver resultados anteriores
            </summary>
            <div className="mt-6 text-left">
              <ResultadosSection mes={params.mes} ano={params.ano} />
            </div>
          </details>
        </div>
      </main>
    </QuadraBackdrop>
  );
}
