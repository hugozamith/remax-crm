import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listAllClients } from "@/actions/clients";
import { listAgentsForFilter } from "@/actions/users";
import { ClientListHeader } from "@/components/ClientListHeader";
import { ClientTable } from "@/components/ClientTable";
import { requireSessionUser } from "@/lib/session";
import type { ClientIntent } from "@prisma/client";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    intent?: ClientIntent;
    agentId?: string;
  }>;
};

export default async function AdminClientsPage({ searchParams }: PageProps) {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") {
    redirect("/clients");
  }

  const params = await searchParams;
  const [clients, agents] = await Promise.all([
    listAllClients({
      search: params.search,
      intent: params.intent,
      agentId: params.agentId,
    }),
    listAgentsForFilter(),
  ]);

  return (
    <div className="space-y-6">
      <Suspense>
        <ClientListHeader
          title="All Clients"
          description="View and manage clients across the entire agency."
          showAgentFilter
          agents={agents}
        />
      </Suspense>
      <ClientTable clients={clients} showAgent />
    </div>
  );
}
