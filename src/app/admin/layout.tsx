import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/security/auth";
import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/acesso-negado");
  }

  return (
    <div className="flex min-h-screen bg-planalto-black">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
