import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { ElencoSection } from "../_components/elenco-section";

interface ElencoPublicoPageProps {
  searchParams: Promise<{ campeonato?: string }>;
}

export default async function ElencoPublicoPage({
  searchParams,
}: ElencoPublicoPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="flex-1">
        <ElencoSection campeonatoFiltro={params.campeonato} />
      </main>
    </QuadraBackdrop>
  );
}
