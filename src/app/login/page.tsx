import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-planalto-black px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
