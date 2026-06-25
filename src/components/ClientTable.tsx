"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteClient } from "@/actions/clients";
import {
  INTENT_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/validations/client";

export type ClientRow = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  propertyType: string | null;
  intent: string;
  price: { toString(): string } | null;
  updatedAt: Date;
  agent?: { id: string; name: string; email: string };
};

type ClientTableProps = {
  clients: ClientRow[];
  showAgent?: boolean;
  canEdit?: boolean;
};

function formatPrice(price: ClientRow["price"], intent: string) {
  if (!price) return "—";
  const value = Number(price.toString());
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: intent === "RENT" ? 0 : 0,
  }).format(value);
}

export function ClientTable({
  clients,
  showAgent = false,
  canEdit = true,
}: ClientTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteClient(deleteId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setDeleteId(null);
    });
  };

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">No clients yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first client to start building your database.
        </p>
        {canEdit && (
          <Button asChild className="mt-4">
            <Link href="/clients/new">Add client</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Intent</th>
              <th className="px-4 py-3 text-left font-medium">Property</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              {showAgent && (
                <th className="px-4 py-3 text-left font-medium">Agent</th>
              )}
              <th className="px-4 py-3 text-left font-medium">Updated</th>
              {canEdit && (
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={client.intent === "SELL" ? "sell" : "rent"}
                  >
                    {INTENT_LABELS[client.intent]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {client.propertyType
                    ? PROPERTY_TYPE_LABELS[client.propertyType]
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {formatPrice(client.price, client.intent)}
                </td>
                {showAgent && (
                  <td className="px-4 py-3">{client.agent?.name ?? "—"}</td>
                )}
                <td className="px-4 py-3 text-muted-foreground">
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                  }).format(new Date(client.updatedAt))}
                </td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/clients/${client.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(client.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete client?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The client record will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
