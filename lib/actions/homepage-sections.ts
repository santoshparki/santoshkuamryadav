"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { homepageSectionKeys } from "@/lib/actions/homepage-section-types";
import { revalidatePublicPortfolio } from "@/lib/actions/helpers";

type HomepageSectionKey = (typeof homepageSectionKeys)[number];

export async function updateHomepageSectionVisibility(
  key: string,
  isVisible: boolean
) {
  await requireAuthenticatedUser();

  const isBuiltIn = homepageSectionKeys.includes(key as HomepageSectionKey);
  const existing = isBuiltIn ? true : await prisma.homepageSection.findUnique({ where: { key } });
  if (!isBuiltIn && !existing) {
    throw new Error("Invalid homepage section.");
  }

  const section = await prisma.homepageSection.upsert({
    where: { key },
    update: { isVisible },
    create: { key, isVisible, sortOrder: homepageSectionKeys.indexOf(key as HomepageSectionKey) * 10 },
  });

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  await revalidatePublicPortfolio();

  return section;
}

export async function reorderHomepageSections(orderedKeys: string[]) {
  await requireAuthenticatedUser();
  const uniqueKeys = [...new Set(orderedKeys)];
  const customKeys = uniqueKeys.filter((key) => key.startsWith("custom-"));
  const existingCustomSections = await prisma.homepageSection.findMany({ where: { key: { in: customKeys } }, select: { key: true } });
  const existingCustomKeys = new Set(existingCustomSections.map((section) => section.key));
  if (uniqueKeys.some((key) => !homepageSectionKeys.includes(key as (typeof homepageSectionKeys)[number]) && !existingCustomKeys.has(key))) {
    throw new Error("Invalid homepage section order.");
  }

  await prisma.$transaction(
    uniqueKeys.map((key, index) =>
      prisma.homepageSection.upsert({
        where: { key },
        update: { sortOrder: index * 10 },
        create: { key, isVisible: true, sortOrder: index * 10 },
      })
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  await revalidatePublicPortfolio();
}

export async function createCustomHomepageSection(title: string, description: string) {
  await requireAuthenticatedUser();
  const cleanTitle = title.trim();
  const cleanDescription = description.trim();
  if (!cleanTitle || !cleanDescription) throw new Error("Title and description are required.");
  if (cleanTitle.length > 100 || cleanDescription.length > 2000) throw new Error("Custom section content is too long.");

  const key = `custom-${crypto.randomUUID()}`;
  const lastSection = await prisma.homepageSection.findFirst({ orderBy: { sortOrder: "desc" } });
  const section = await prisma.homepageSection.create({
    data: { key, title: cleanTitle, description: cleanDescription, sortOrder: (lastSection?.sortOrder ?? 0) + 10 },
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  await revalidatePublicPortfolio();
  return section;
}

export async function updateCustomHomepageSection(key: string, title: string, description: string) {
  await requireAuthenticatedUser();
  if (!key.startsWith("custom-")) throw new Error("Only custom sections can be edited.");
  const cleanTitle = title.trim();
  const cleanDescription = description.trim();
  if (!cleanTitle || !cleanDescription) throw new Error("Title and description are required.");
  if (cleanTitle.length > 100 || cleanDescription.length > 2000) throw new Error("Custom section content is too long.");

  const section = await prisma.homepageSection.update({
    where: { key },
    data: { title: cleanTitle, description: cleanDescription },
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  await revalidatePublicPortfolio();
  return section;
}

export async function deleteCustomHomepageSection(key: string) {
  await requireAuthenticatedUser();
  if (!key.startsWith("custom-")) throw new Error("Only custom sections can be deleted.");
  await prisma.homepageSection.delete({ where: { key } });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  await revalidatePublicPortfolio();
}

export async function resetHomepageSectionOrder() {
  await requireAuthenticatedUser();
  const customSections = await prisma.homepageSection.findMany({ where: { key: { startsWith: "custom-" } }, select: { key: true, sortOrder: true } });
  await prisma.$transaction([
    ...homepageSectionKeys.map((key, index) => prisma.homepageSection.upsert({
      where: { key },
      update: { sortOrder: (index + 1) * 10 },
      create: { key, isVisible: true, sortOrder: (index + 1) * 10 },
    })),
    ...customSections.map((section, index) => prisma.homepageSection.update({ where: { key: section.key }, data: { sortOrder: (homepageSectionKeys.length + index + 1) * 10 } })),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}
