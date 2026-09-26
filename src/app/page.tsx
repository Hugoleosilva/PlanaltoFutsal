import { PublicNav } from "./_components/public-nav";
import { HeroSection } from "./_components/hero-section";
import { HistoriaSection } from "./_components/historia-section";
import { ElencoSection } from "./_components/elenco-section";
import { AgendaSection } from "./_components/agenda-section";
import { GaleriaSection } from "./_components/galeria-section";
import { EnviarFotoSection } from "./_components/enviar-foto-section";
import { CaronaSection } from "./_components/carona-section";
import { EngajamentoSection } from "./_components/engajamento-section";
import { MuralSection } from "./_components/mural-section";
import { PixSection } from "./_components/pix-section";
import { PatrocinadoresSection } from "./_components/patrocinadores-section";
import { LojaSection } from "./_components/loja-section";
import { PublicFooter } from "./_components/public-footer";

export default function HomePage(): React.ReactElement {
  return (
    <>
      <PublicNav />
      <main>
        <HeroSection />
        <HistoriaSection />
        <ElencoSection />
        <AgendaSection />
        <MuralSection />
        <GaleriaSection />
        <EnviarFotoSection />
        <CaronaSection />
        <EngajamentoSection />
        <PixSection />
        <PatrocinadoresSection />
        <LojaSection />
      </main>
      <PublicFooter />
    </>
  );
}
