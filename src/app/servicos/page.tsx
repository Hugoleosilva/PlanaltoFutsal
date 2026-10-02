import Link from "next/link";
import { auth } from "@/infrastructure/security/auth";
import { PublicNav } from "../_components/public-nav";
import { HeroFaixa } from "../_components/hero-faixa";
import { ServicosLista } from "../_components/servicos-lista";
import { PublicarServicoForm } from "../_components/publicar-servico-form";
import { PublicFooter } from "../_components/public-footer";
import { Card } from "@/shared/components/ui/card";

export default async function ServicosPage(): Promise<React.ReactElement> {
  const session = await auth();

  return (
    <>
      <PublicNav />
      <HeroFaixa />
      <main className="flex-1 mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-center font-heading text-3xl font-bold text-planalto-white">
          Serviços da Comunidade
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-planalto-gray">
          Trabalhos e serviços divulgados por gente da nossa torcida e do nosso elenco.
        </p>

        <div className="mt-10">
          <ServicosLista />
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          {session?.user ? (
            <PublicarServicoForm />
          ) : (
            <Card className="text-center">
              <p className="text-planalto-white">Quer divulgar seu trabalho aqui?</p>
              <p className="mt-1 text-sm text-planalto-gray">
                Só quem tem conta no site pode publicar. É rápido e grátis.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link
                  href="/login?callbackUrl=/servicos"
                  className="rounded-md bg-planalto-red px-4 py-2 text-sm font-semibold text-white hover:bg-planalto-red-dark"
                >
                  Fazer Login
                </Link>
                <Link
                  href="/cadastro"
                  className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Criar conta
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
