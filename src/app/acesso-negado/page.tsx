import Link from "next/link";

export default function AcessoNegadoPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-foreground">Acesso negado</h1>
      <p className="text-muted-foreground">
        Você não tem permissão para acessar esta página.
      </p>
      <Link href="/inicio" className="text-planalto-red underline">
        Voltar para a página inicial
      </Link>
    </main>
  );
}
