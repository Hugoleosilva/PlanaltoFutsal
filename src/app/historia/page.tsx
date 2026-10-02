import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { HistoriaSection } from "../_components/historia-section";

export default function HistoriaPage(): React.ReactElement {
  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="flex-1">
        <HistoriaSection />
      </main>
    </QuadraBackdrop>
  );
}
