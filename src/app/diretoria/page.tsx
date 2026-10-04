import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { DiretoriaSection } from "../_components/diretoria-section";

export const dynamic = "force-dynamic";

export default function DiretoriaPage(): React.ReactElement {
  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="flex-1">
        <DiretoriaSection />
      </main>
    </QuadraBackdrop>
  );
}
