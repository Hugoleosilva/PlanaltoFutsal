import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/security/auth";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminPresenceChat } from "./_components/admin-presence-chat";

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
    <div className="flex min-h-screen flex-col bg-planalto-black lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      <AdminPresenceChat />
    </div>
  );
}
