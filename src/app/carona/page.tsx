import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { CaronaSection } from "../_components/carona-section";

export default function CaronaPage(): React.ReactElement {
  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="flex-1">
        <CaronaSection />
      </main>
    </QuadraBackdrop>
  );
}
