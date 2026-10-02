import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage(): React.ReactElement {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <Image
        src="/images/marca/fundo-tela-novo-com-escudo-planalto.jpg"
        alt="Fundo Planalto Futsal"
        fill
        priority
        className="object-cover opacity-30"
      />

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
