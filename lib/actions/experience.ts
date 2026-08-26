"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { experienceFormSchema, type ExperienceFormData } from "@/lib/validations/content";

export async function listExperiences() {
  return prisma.experience.findMany({ orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] });
}

export async function createExperience(input: ExperienceFormData) {
  await requireAuthenticatedUser();
  const parsed = experienceFormSchema.parse(input);
  const data = {
    ...parsed,
    startDate: parsed.startDate ? new Date(parsed.startDate) : null,
    endDate: parsed.endDate ? new Date(parsed.endDate) : null,
  };
  const record = await prisma.experience.create({ data });
  revalidatePath("/admin/experience");
  return record;
}

export async function updateExperience(id: string, input: ExperienceFormData) {
  await requireAuthenticatedUser();
  const parsed = experienceFormSchema.parse(input);
  const data = {
    ...parsed,
    startDate: parsed.startDate ? new Date(parsed.startDate) : null,
    endDate: parsed.endDate ? new Date(parsed.endDate) : null,
  };
  const record = await prisma.experience.update({ where: { id }, data });
  revalidatePath("/admin/experience");
  return record;
}

export async function deleteExperience(id: string) {
  await requireAuthenticatedUser();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experience");
}
