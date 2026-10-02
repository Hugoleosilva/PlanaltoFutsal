import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { CaronaSection } from "../_components/carona-section";
import { PublicFooter } from "../_components/public-footer";

export default function CaronaPage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <CaronaSection />
      </main>
      <PublicFooter />
    </>
  );
}
