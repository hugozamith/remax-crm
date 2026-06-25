"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { createAgentSchema } from "@/lib/validations/client";
import type { ActionState } from "@/actions/clients";

export async function listAgents() {
  await requireAdmin();

  return db.user.findMany({
    where: { role: "AGENT" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { clients: true } },
    },
  });
}

export async function listAgentsForFilter() {
  await requireAdmin();

  return db.user.findMany({
    where: { role: "AGENT" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function createAgent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();

    const raw = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsed = createAgentSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
        message: "Please fix the errors below.",
      };
    }

    const existing = await db.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (existing) {
      return {
        success: false,
        errors: { email: ["An account with this email already exists."] },
        message: "Email already in use.",
      };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        password: hashedPassword,
        role: "AGENT",
      },
    });

    revalidatePath("/admin/agents");
    return { success: true, message: "Agent created successfully." };
  } catch {
    return { success: false, message: "Failed to create agent." };
  }
}
