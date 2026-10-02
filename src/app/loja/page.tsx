import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { LojaSection } from "../_components/loja-section";
import { PublicFooter } from "../_components/public-footer";

export default function LojaPage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <LojaSection />
      </main>
      <PublicFooter />
    </>
  );
}
