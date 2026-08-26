"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { siteSettingsFormSchema, type SiteSettingsFormData } from "@/lib/validations/content";

export async function getSiteSettings() {
  return prisma.siteSetting.findFirst();
}

export async function upsertSiteSettings(input: SiteSettingsFormData) {
  await requireAuthenticatedUser();
  const parsed = siteSettingsFormSchema.parse(input);
  const existing = await prisma.siteSetting.findFirst();

  if (existing) {
    const record = await prisma.siteSetting.update({
      where: { id: existing.id },
      data: {
        siteTitle: parsed.siteName,
        seoDescription: parsed.siteDescription || null,
        logoUrl: parsed.logoUrl || null,
        faviconUrl: parsed.faviconUrl || null,
      },
    });
    revalidatePath("/admin/settings");
    return record;
  }

  const record = await prisma.siteSetting.create({
    data: {
        siteTitle: parsed.siteName,
        seoDescription: parsed.siteDescription || null,
        logoUrl: parsed.logoUrl || null,
        faviconUrl: parsed.faviconUrl || null,
      userId: (await prisma.user.findFirst())?.id ?? "00000000-0000-0000-0000-000000000000",
    },
  });
  revalidatePath("/admin/settings");
  return record;
}
