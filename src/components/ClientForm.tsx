"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/actions/clients";
import type { ClientFormValues } from "@/lib/validations/client";
import { PROPERTY_TYPE_LABELS } from "@/lib/validations/client";
import { cn } from "@/lib/utils";

type ClientFormProps = {
  action: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  defaultValues?: Partial<ClientFormValues> & { id?: string };
  submitLabel?: string;
  redirectTo?: string;
};

const initialState: ActionState = { success: false };

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function ClientForm({
  action,
  defaultValues,
  submitLabel = "Save client",
  redirectTo = "/clients",
}: ClientFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        router.push(redirectTo);
      } else if (!state.errors) {
        toast.error(state.message);
      }
    }
  }, [state, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Client name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues?.name}
            required
          />
          {state.errors?.name && (
            <p className="text-sm text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues?.phone}
            required
          />
          {state.errors?.phone && (
            <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property type</Label>
          <select
            id="propertyType"
            name="propertyType"
            defaultValue={defaultValues?.propertyType ?? ""}
            className={selectClassName}
          >
            <option value="">Select type</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            defaultValue={defaultValues?.bedrooms ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            step="0.5"
            defaultValue={defaultValues?.bathrooms ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sizeSqm">Size (m²)</Label>
          <Input
            id="sizeSqm"
            name="sizeSqm"
            type="number"
            min="0"
            step="0.1"
            defaultValue={defaultValues?.sizeSqm ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (EUR)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.price ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intent">Intent *</Label>
          <select
            id="intent"
            name="intent"
            defaultValue={defaultValues?.intent ?? ""}
            required
            className={cn(selectClassName)}
          >
            <option value="" disabled>
              Sell or rent?
            </option>
            <option value="SELL">Sell</option>
            <option value="RENT">Rent</option>
          </select>
          {state.errors?.intent && (
            <p className="text-sm text-destructive">{state.errors.intent[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaultValues?.notes ?? ""}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
