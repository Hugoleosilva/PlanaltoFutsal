import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { AgendaSection } from "../_components/agenda-section";
import { PublicFooter } from "../_components/public-footer";

export default function AgendaPage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <AgendaSection />
      </main>
      <PublicFooter />
    </>
  );
}
