import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { CaronaSection } from "../_components/carona-section";

export default function CaronaPage(): React.ReactElement {
  return (
    <QuadraBackdrop semRolagem>
      <PublicNav />
      <main className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
        <CaronaSection />
      </main>
    </QuadraBackdrop>
  );
}
