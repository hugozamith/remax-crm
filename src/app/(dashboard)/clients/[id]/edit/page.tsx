import Link from "next/link";
import { notFound } from "next/navigation";
import { getClient, updateClient } from "@/actions/clients";
import { ClientForm } from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  const updateAction = updateClient.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clients">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit client</h1>
          <p className="text-muted-foreground">Update {client.name}&apos;s record.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            action={updateAction}
            submitLabel="Save changes"
            defaultValues={{
              name: client.name,
              phone: client.phone,
              address: client.address ?? undefined,
              propertyType: client.propertyType ?? undefined,
              bedrooms: client.bedrooms ?? undefined,
              bathrooms: client.bathrooms ?? undefined,
              sizeSqm: client.sizeSqm ?? undefined,
              price: client.price ? Number(client.price) : undefined,
              intent: client.intent,
              notes: client.notes ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
