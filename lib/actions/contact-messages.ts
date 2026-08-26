"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { contactSchema, type ContactFormData } from "@/lib/validations";

export async function listContactMessages() {
  await requireAuthenticatedUser();
  return prisma.contactMessage.findMany({ orderBy: [{ createdAt: "desc" }] });
}

export async function createContactMessage(input: ContactFormData) {
  const parsed = contactSchema.parse(input);
  const record = await prisma.contactMessage.create({ data: parsed });
  revalidatePath("/admin/messages");
  return record;
}

export async function markContactMessageAsRead(id: string) {
  await requireAuthenticatedUser();
  const record = await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/messages");
  return record;
}

export async function deleteContactMessage(id: string) {
  await requireAuthenticatedUser();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
