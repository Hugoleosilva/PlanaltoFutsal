import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { DiretoriaSection } from "../_components/diretoria-section";
import { PublicFooter } from "../_components/public-footer";

export default function DiretoriaPage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <DiretoriaSection />
      </main>
      <PublicFooter />
    </>
  );
}
