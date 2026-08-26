"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { aboutFormSchema, aboutTagSchema } from "@/lib/validations/about";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function ensureAboutRecord() {
  const existing = await prisma.about.findFirst();
  if (isRecord(existing)) {
    return existing as { id: string };
  }

  // Ensure there's a valid user for the About record's foreign key.
  // Prefer an existing user; if none exists, create a lightweight admin user.
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "admin@example.com",
        fullName: "Site Admin",
      },
    });
  }

  return prisma.about.create({
    data: {
      userId: user.id,
    },
  });
}

export async function upsertAbout(input: z.infer<typeof aboutFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = aboutFormSchema.parse(input);
  const existing = await ensureAboutRecord();

  const about = await prisma.about.update({
    where: { id: existing.id as string },
    data: {
      sectionTitle: parsed.sectionTitle ?? null,
      sectionSubtitle: parsed.sectionSubtitle ?? null,
      shortBio: parsed.shortBio ?? null,
      longBio: parsed.longBio ?? null,
      readMoreButtonText: parsed.readMoreButtonText ?? null,
      showLessButtonText: parsed.showLessButtonText ?? null,
    },
  });

  revalidatePath("/admin/about");
  revalidatePath("/");
  return about;
}

export async function createAboutTag(aboutId: string, input: z.infer<typeof aboutTagSchema>) {
  await requireAuthenticatedUser();
  const parsed = aboutTagSchema.parse(input);

  if (!aboutId) {
    const record = await ensureAboutRecord();
    aboutId = record.id as string;
  }

  const tag = await prisma.aboutTag.create({
    data: {
      aboutId,
      label: parsed.label,
      icon: parsed.icon ?? null,
      displayOrder: parsed.displayOrder,
      isActive: parsed.isActive,
    },
  });

  revalidatePath("/admin/about");
  revalidatePath("/");
  return tag;
}

export async function updateAboutTag(id: string, input: z.infer<typeof aboutTagSchema>) {
  await requireAuthenticatedUser();
  const parsed = aboutTagSchema.parse(input);

  const tag = await prisma.aboutTag.update({
    where: { id },
    data: {
      label: parsed.label,
      icon: parsed.icon ?? null,
      displayOrder: parsed.displayOrder,
      isActive: parsed.isActive,
    },
  });

  revalidatePath("/admin/about");
  revalidatePath("/");
  return tag;
}

export async function deleteAboutTag(id: string) {
  await requireAuthenticatedUser();
  await prisma.aboutTag.delete({ where: { id } });
  revalidatePath("/admin/about");
  revalidatePath("/");
  return null;
}
