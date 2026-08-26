"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { educationFormSchema, type EducationFormData } from "@/lib/validations/content";

export async function listEducation() {
  return prisma.education.findMany({ orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] });
}

export async function createEducation(input: EducationFormData) {
  await requireAuthenticatedUser();
  const parsed = educationFormSchema.parse(input);
  const record = await prisma.education.create({
    data: {
      ...parsed,
      startDate: parsed.startDate ? new Date(parsed.startDate) : null,
      endDate: parsed.endDate ? new Date(parsed.endDate) : null,
    },
  });
  revalidatePath("/admin/education");
  return record;
}

export async function updateEducation(id: string, input: EducationFormData) {
  await requireAuthenticatedUser();
  const parsed = educationFormSchema.parse(input);
  const record = await prisma.education.update({
    where: { id },
    data: {
      ...parsed,
      startDate: parsed.startDate ? new Date(parsed.startDate) : null,
      endDate: parsed.endDate ? new Date(parsed.endDate) : null,
    },
  });
  revalidatePath("/admin/education");
  return record;
}

export async function deleteEducation(id: string) {
  await requireAuthenticatedUser();
  await prisma.education.delete({ where: { id } });
  revalidatePath("/admin/education");
}
