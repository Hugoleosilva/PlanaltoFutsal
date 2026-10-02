import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { GaleriaSection } from "../_components/galeria-section";
import { EnviarFotoSection } from "../_components/enviar-foto-section";
import { PublicFooter } from "../_components/public-footer";
import { Collapsible } from "@/shared/components/ui/collapsible";

export default function GaleriaPage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1">
        <GaleriaSection />

        <div className="mx-auto max-w-2xl px-6 pb-16">
          <Collapsible titulo="Quer enviar suas fotos?">
            <EnviarFotoSection semTitulo />
          </Collapsible>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
