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
            src="/images/marca/capa-planalto-futsal.jpg"
            alt=""
            fill
            className="object-cover opacity-30"
            unoptimized
            priority
          />
        </div>

        <div className="pt-3">
          <ProximoJogoTicker />
          <main>
            <MuralSection />
            <EngajamentoSection />
            <div className="mt-10">
              <PatrocinadoresSection />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
