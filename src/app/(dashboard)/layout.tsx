import { DashboardSidebar } from "@/components/DashboardSidebar";
import { requireSessionUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={user} />
      <main className="min-w-0 p-4 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
