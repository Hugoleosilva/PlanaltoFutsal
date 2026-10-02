import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { HistoriaSection } from "../_components/historia-section";
import { PublicFooter } from "../_components/public-footer";

export default function HistoriaPage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <HistoriaSection />
      </main>
      <PublicFooter />
    </>
  );
}
