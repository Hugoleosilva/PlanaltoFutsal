import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { GaleriaSection } from "../_components/galeria-section";
import { EnviarFotoSection } from "../_components/enviar-foto-section";
import { Collapsible } from "@/shared/components/ui/collapsible";

export const dynamic = "force-dynamic";

export default function GaleriaPage(): React.ReactElement {
  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="flex-1">
        <GaleriaSection />

        <div className="mx-auto max-w-2xl px-6 pb-16">
          <Collapsible titulo="Tem Alguma Foto Massa? Manda Aqui Pra Gente?">
            <EnviarFotoSection semTitulo />
          </Collapsible>
        </div>
      </main>
    </QuadraBackdrop>
  );
}
