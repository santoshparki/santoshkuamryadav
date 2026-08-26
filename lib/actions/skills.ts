"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { skillCategoryFormSchema, skillFormSchema } from "@/lib/validations/skills";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

export async function listSkillCategories() {
  return prisma.skillCategory.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getSkillCategory(id: string) {
  return prisma.skillCategory.findUnique({ where: { id } });
}

export async function createSkillCategory(input: z.infer<typeof skillCategoryFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = skillCategoryFormSchema.parse(input);
  const category = await prisma.skillCategory.create({ data: parsed });
  revalidatePath("/admin/skills");
  return category;
}

export async function updateSkillCategory(id: string, input: z.infer<typeof skillCategoryFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = skillCategoryFormSchema.parse(input);
  const category = await prisma.skillCategory.update({ where: { id }, data: parsed });
  revalidatePath("/admin/skills");
  return category;
}

export async function deleteSkillCategory(id: string) {
  await requireAuthenticatedUser();
  await prisma.skillCategory.delete({ where: { id } });
  revalidatePath("/admin/skills");
}

export async function listSkills(search?: string) {
  return prisma.skill.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { icon: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: true },
  });
}

export async function getSkill(id: string) {
  return prisma.skill.findUnique({ where: { id }, include: { category: true } });
}

export async function createSkill(input: z.infer<typeof skillFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = skillFormSchema.parse(input);
  const skill = await prisma.skill.create({ data: parsed, include: { category: true } });
  revalidatePath("/admin/skills");
  return skill;
}

export async function updateSkill(id: string, input: z.infer<typeof skillFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = skillFormSchema.parse(input);
  const skill = await prisma.skill.update({ where: { id }, data: parsed, include: { category: true } });
  revalidatePath("/admin/skills");
  return skill;
}

export async function deleteSkill(id: string) {
  await requireAuthenticatedUser();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
}
