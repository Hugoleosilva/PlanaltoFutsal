import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/security/auth";
import { QuadraBackdrop } from "../_components/quadra-backdrop";
import { AtletaTopbar } from "./_components/atleta-topbar";

export default async function AtletaLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ATLETA" && session.user.role !== "ADMIN")) {
    redirect("/acesso-negado");
  }

  return (
    <QuadraBackdrop>
      <AtletaTopbar />
      {children}
    </QuadraBackdrop>
  );
}
