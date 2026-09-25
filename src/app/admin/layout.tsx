import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/security/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/acesso-negado");
  }

  return <div className="min-h-screen bg-planalto-black">{children}</div>;
}
