import Link from "next/link";
import { auth } from "@/infrastructure/security/auth";
import { PublicNav } from "../_components/public-nav";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { ServicosLista } from "../_components/servicos-lista";
import { PublicarServicoForm } from "../_components/publicar-servico-form";
import { Card } from "@/shared/components/ui/card";

interface ServicosPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ServicosPage({ searchParams }: ServicosPageProps): Promise<React.ReactElement> {
  const [session, params] = await Promise.all([auth(), searchParams]);

  return (
    <QuadraBackdrop>
      <PublicNav />
      <main className="mx-auto max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-center font-heading text-3xl font-bold text-foreground">
          Rede de Apoio
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Divulgue os Trabalhos e Serviços feitos por gente da nossa Comunidade.
        </p>

        <div className="mt-10">
          <ServicosLista categoriaFiltro={params.categoria} />
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          {session?.user ? (
            <PublicarServicoForm />
          ) : (
            <Card className="text-center">
              <p className="text-foreground">Quer divulgar seu trabalho aqui?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie uma conta no site e publique seu trabalho. É rápido e grátis.
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
                  className="rounded-md border border-surface/20 px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface/10"
                >
                  Criar conta
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>
    </QuadraBackdrop>
  );
}
