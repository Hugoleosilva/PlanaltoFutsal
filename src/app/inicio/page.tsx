import Image from "next/image";
import { PublicNav } from "../_components/public-nav";
import { ProximoJogoTicker } from "../_components/proximo-jogo-ticker";
import { MuralSection } from "../_components/mural-section";
import { EngajamentoSection } from "../_components/engajamento-section";
// import { PatrocinadoresSection } from "../_components/patrocinadores-section";

export default function InicioPage(): React.ReactElement {
  return (
    <>
      <PublicNav />

      <div className="relative flex-1">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/marca/fundo-tela-novo-com-escudo-planalto.jpg"
            alt=""
            fill
            className="object-cover object-top"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
        </div>

        <div className="pt-3">
          <ProximoJogoTicker />
          <main>
            <MuralSection />
            <div className="mt-52 sm:mt-72">
              <EngajamentoSection />
            </div>
            {/* <div className="mt-10">
              <PatrocinadoresSection />
            </div> */}
          </main>
        </div>
      </div>
    </>
  );
}
