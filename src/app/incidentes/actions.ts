"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createIncident(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  await db.incident.create({
    title,
    description,
    severity: priority, // Mapping priority form field to severity db column
    status,
  });

  revalidatePath("/incidentes");
  return { success: true };
}

export async function updateIncidentStatus(id: number, status: string) {
  await db.incident.update(id, { status });
  revalidatePath("/incidentes");
}

export async function deleteIncident(id: number) {
  await db.incident.delete(id);
  revalidatePath("/incidentes");
}
