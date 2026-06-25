import { Suspense } from "react";
import Link from "next/link";
import { listMyClients } from "@/actions/clients";
import { ClientListHeader } from "@/components/ClientListHeader";
import { ClientTable } from "@/components/ClientTable";
import type { ClientIntent } from "@prisma/client";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    intent?: ClientIntent;
  }>;
};

export default async function ClientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const clients = await listMyClients({
    search: params.search,
    intent: params.intent,
  });

  return (
    <div className="space-y-6">
      <Suspense>
        <ClientListHeader
          title="My Clients"
          description="Manage your client and property records."
        />
      </Suspense>
      <ClientTable clients={clients} />
    </div>
  );
}
