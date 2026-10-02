import Image from "next/image";
import { PublicNav } from "../_components/public-nav";
import { ProximoJogoTicker } from "../_components/proximo-jogo-ticker";
import { MuralSection } from "../_components/mural-section";
import { EngajamentoSection } from "../_components/engajamento-section";
import { PatrocinadoresSection } from "../_components/patrocinadores-section";

export default function InicioPage(): React.ReactElement {
  return (
    <>
      <PublicNav />

      <div className="relative flex-1">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/marca/planalto_quadra.png"
            alt=""
            fill
            className="object-cover object-bottom"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="pt-3">
          <ProximoJogoTicker />
          <main>
            <MuralSection />
            <EngajamentoSection />
            <div className="mt-[188px]">
              <PatrocinadoresSection />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
