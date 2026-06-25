"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { clientFormSchema } from "@/lib/validations/client";
import type { ClientIntent, PropertyType } from "@prisma/client";

function parseClientInput(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address") || undefined,
    propertyType: formData.get("propertyType") || undefined,
    bedrooms: formData.get("bedrooms") || undefined,
    bathrooms: formData.get("bathrooms") || undefined,
    sizeSqm: formData.get("sizeSqm") || undefined,
    price: formData.get("price") || undefined,
    intent: formData.get("intent"),
    notes: formData.get("notes") || undefined,
  };

  return clientFormSchema.safeParse(raw);
}

function toClientData(parsed: ReturnType<typeof clientFormSchema.parse>) {
  return {
    name: parsed.name,
    phone: parsed.phone,
    address: parsed.address || null,
    propertyType: (parsed.propertyType ?? null) as PropertyType | null,
    bedrooms: parsed.bedrooms ?? null,
    bathrooms: parsed.bathrooms ?? null,
    sizeSqm: parsed.sizeSqm ?? null,
    price: parsed.price ?? null,
    intent: parsed.intent as ClientIntent,
    notes: parsed.notes || null,
  };
}

async function getAccessibleClient(clientId: string, userId: string, role: string) {
  const client = await db.client.findUnique({
    where: { id: clientId },
    include: { agent: { select: { id: true, name: true, email: true } } },
  });

  if (!client) return null;
  if (role !== "ADMIN" && client.agentId !== userId) return null;
  return client;
}

export async function listMyClients(filters?: {
  search?: string;
  intent?: ClientIntent;
}) {
  const user = await requireAuth();

  const where = {
    agentId: user.id,
    ...(filters?.intent ? { intent: filters.intent } : {}),
    ...(filters?.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { phone: { contains: filters.search, mode: "insensitive" as const } },
            { address: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  return db.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { agent: { select: { id: true, name: true, email: true } } },
  });
}

export async function listAllClients(filters?: {
  search?: string;
  intent?: ClientIntent;
  agentId?: string;
}) {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const where = {
    ...(filters?.agentId ? { agentId: filters.agentId } : {}),
    ...(filters?.intent ? { intent: filters.intent } : {}),
    ...(filters?.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { phone: { contains: filters.search, mode: "insensitive" as const } },
            { address: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  return db.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { agent: { select: { id: true, name: true, email: true } } },
  });
}

export async function getClient(clientId: string) {
  const user = await requireAuth();
  return getAccessibleClient(clientId, user.id, user.role);
}

export async function createClient(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireAuth();
    const parsed = parseClientInput(formData);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
        message: "Please fix the errors below.",
      };
    }

    await db.client.create({
      data: {
        ...toClientData(parsed.data),
        agentId: user.id,
      },
    });

    revalidatePath("/clients");
    revalidatePath("/admin");
    return { success: true, message: "Client created successfully." };
  } catch {
    return { success: false, message: "Failed to create client." };
  }
}

export async function updateClient(
  clientId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireAuth();
    const existing = await getAccessibleClient(clientId, user.id, user.role);

    if (!existing) {
      return { success: false, message: "Client not found." };
    }

    const parsed = parseClientInput(formData);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
        message: "Please fix the errors below.",
      };
    }

    await db.client.update({
      where: { id: clientId },
      data: toClientData(parsed.data),
    });

    revalidatePath("/clients");
    revalidatePath("/admin");
    revalidatePath(`/clients/${clientId}/edit`);
    return { success: true, message: "Client updated successfully." };
  } catch {
    return { success: false, message: "Failed to update client." };
  }
}

export async function deleteClient(clientId: string): Promise<ActionState> {
  try {
    const user = await requireAuth();
    const existing = await getAccessibleClient(clientId, user.id, user.role);

    if (!existing) {
      return { success: false, message: "Client not found." };
    }

    await db.client.delete({ where: { id: clientId } });

    revalidatePath("/clients");
    revalidatePath("/admin");
    return { success: true, message: "Client deleted successfully." };
  } catch {
    return { success: false, message: "Failed to delete client." };
  }
}

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};
