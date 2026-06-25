import Link from "next/link";
import { createClient } from "@/actions/clients";
import { ClientForm } from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clients">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add client</h1>
          <p className="text-muted-foreground">
            Create a new client record with property details.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm action={createClient} submitLabel="Create client" />
        </CardContent>
      </Card>
    </div>
  );
}
