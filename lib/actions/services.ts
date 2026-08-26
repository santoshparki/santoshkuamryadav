"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { serviceFormSchema, type ServiceFormData } from "@/lib/validations/content";

export async function listServices() {
  return prisma.service.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
}

export async function createService(input: ServiceFormData) {
  await requireAuthenticatedUser();
  const parsed = serviceFormSchema.parse(input);
  const record = await prisma.service.create({
    data: {
      ...parsed,
      features: parsed.features?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    },
  });
  revalidatePath("/admin/services");
  return record;
}

export async function updateService(id: string, input: ServiceFormData) {
  await requireAuthenticatedUser();
  const parsed = serviceFormSchema.parse(input);
  const record = await prisma.service.update({
    where: { id },
    data: {
      ...parsed,
      features: parsed.features?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    },
  });
  revalidatePath("/admin/services");
  return record;
}

export async function deleteService(id: string) {
  await requireAuthenticatedUser();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}
