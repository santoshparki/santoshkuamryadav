"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { socialLinksSchema, type SocialLinksFormData } from "@/lib/validations/content";

export async function getSocialLinks() {
  return prisma.socialLink.findFirst();
}

export async function upsertSocialLinks(input: SocialLinksFormData) {
  await requireAuthenticatedUser();
  const parsed = socialLinksSchema.parse(input);
  const existing = await prisma.socialLink.findFirst();

  if (existing) {
    const record = await prisma.socialLink.update({
      where: { id: existing.id },
      data: {
        facebookUrl: parsed.facebookUrl || null,
        githubUrl: parsed.githubUrl || null,
        linkedinUrl: parsed.linkedinUrl || null,
        xUrl: parsed.xUrl || null,
        instagramUrl: parsed.instagramUrl || null,
        youtubeUrl: parsed.youtubeUrl || null,
        portfolioUrl: parsed.portfolioUrl || null,
      },
    });
    revalidatePath("/admin/social-links");
    return record;
  }

  const record = await prisma.socialLink.create({
    data: {
      userId: (await prisma.user.findFirst())?.id ?? "00000000-0000-0000-0000-000000000000",
      facebookUrl: parsed.facebookUrl || null,
      githubUrl: parsed.githubUrl || null,
      linkedinUrl: parsed.linkedinUrl || null,
      xUrl: parsed.xUrl || null,
      instagramUrl: parsed.instagramUrl || null,
      youtubeUrl: parsed.youtubeUrl || null,
      portfolioUrl: parsed.portfolioUrl || null,
    },
  });
  revalidatePath("/admin/social-links");
  return record;
}
