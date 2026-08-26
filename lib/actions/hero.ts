"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { heroFormSchema } from "@/lib/validations/hero";
import { uploadFileToStorage, getPublicUrl } from "@/lib/actions/storage";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function upsertHero(input: z.infer<typeof heroFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = heroFormSchema.parse(input);
  const existing = await prisma.hero.findFirst();
  const normalized = {
    fullName: parsed.fullName ?? null,
    professionalTitle: parsed.professionalTitle ?? null,
    headline: parsed.headline ?? parsed.heading ?? null,
    subheadline: parsed.subheadline ?? parsed.subHeading ?? null,
    heading: parsed.headline ?? parsed.heading ?? null,
    subHeading: parsed.subheadline ?? parsed.subHeading ?? null,
    primaryButtonText: parsed.primaryButtonText ?? parsed.ctaLabel ?? null,
    primaryButtonUrl: parsed.primaryButtonUrl ?? parsed.ctaHref ?? null,
    secondaryButtonText: parsed.secondaryButtonText ?? null,
    secondaryButtonUrl: parsed.secondaryButtonUrl ?? null,
    enableResumeDownload: parsed.enableResumeDownload ?? false,
    resumeButtonText: parsed.resumeButtonText ?? parsed.resumeButtonLabel ?? null,
    showSocialLinks: parsed.showSocialLinks ?? false,
    showAvailabilityBadge: parsed.showAvailabilityBadge ?? false,
    availabilityStatus: parsed.availabilityStatus ?? null,
    location: parsed.location ?? null,
    yearsOfExperience: parsed.yearsOfExperience ?? null,
    ctaLabel: parsed.primaryButtonText ?? parsed.ctaLabel ?? null,
    ctaHref: parsed.primaryButtonUrl ?? parsed.ctaHref ?? null,
    resumeButtonLabel: parsed.resumeButtonText ?? parsed.resumeButtonLabel ?? null,
    resumeButtonHref: parsed.resumeButtonHref ?? null,
  } as const;

  const hero = isRecord(existing)
    ? await prisma.hero.update({
        where: { id: existing.id as string },
        data: normalized,
      })
    : await prisma.hero.create({ data: normalized });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return hero;
}

export async function uploadHeroImage(file: File, field: "backgroundImageUrl" | "heroImageUrl") {
  await requireAuthenticatedUser();
  const path = `hero/${field}-${Date.now()}-${file.name}`;
  const storedPath = await uploadFileToStorage(file, "portfolio-assets", path);
  const publicUrl = await getPublicUrl("portfolio-assets", storedPath as string);

  const existing = await prisma.hero.findFirst();
  if (!isRecord(existing)) return publicUrl;

  await prisma.hero.update({
    where: { id: existing.id as string },
    data: { [field]: publicUrl },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return publicUrl;
}

export async function uploadHeroResume(file: File) {
  await requireAuthenticatedUser();
  const extension = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["pdf", "doc", "docx"];
  const maxSizeBytes = 10 * 1024 * 1024;

  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error("Only PDF, DOC, or DOCX files are allowed.");
  }

  if (file.size > maxSizeBytes) {
    throw new Error("Resume files must be 10 MB or smaller.");
  }

  const path = `resumes/resume-${Date.now()}-${file.name}`;
  const storedPath = await uploadFileToStorage(file, "portfolio-assets", path);
  const publicUrl = await getPublicUrl("portfolio-assets", storedPath as string);

  const existing = await prisma.hero.findFirst();
  const data = {
    resumeUrl: publicUrl,
    resumeFileName: file.name,
    resumeFileType: extension,
    enableResumeDownload: true,
  };

  if (!isRecord(existing)) {
    await prisma.hero.create({ data });
  } else {
    await prisma.hero.update({
      where: { id: existing.id as string },
      data,
    });
  }

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { url: publicUrl, fileName: file.name, fileType: extension };
}

export async function deleteHeroResume() {
  await requireAuthenticatedUser();
  const existing = await prisma.hero.findFirst();
  if (!isRecord(existing)) return null;

  await prisma.hero.update({
    where: { id: existing.id as string },
    data: {
      resumeUrl: null,
      resumeFileName: null,
      resumeFileType: null,
      enableResumeDownload: false,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return null;
}
