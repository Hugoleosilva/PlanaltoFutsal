import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage(): React.ReactElement {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pb-12 pt-80">
      <Image
        src="/images/marca/fundo-tela-novo-com-escudo-planalto.jpg"
        alt="Fundo Planalto Futsal"
        fill
        priority
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
