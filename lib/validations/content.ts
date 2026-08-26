import { z } from "zod";

const optionalUrl = z.string().url("Invalid URL").optional().or(z.literal(""));

export const serviceFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(2_000).optional(),
  icon: z.string().trim().max(100).optional(),
  features: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const experienceFormSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(160),
  position: z.string().trim().min(1, "Position is required").max(160),
  location: z.string().trim().max(160).optional(),
  description: z.string().trim().max(5_000).optional(),
  startDate: z.string().date().optional().or(z.literal("")),
  endDate: z.string().date().optional().or(z.literal("")),
  isCurrent: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const educationFormSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(160),
  degree: z.string().trim().min(1, "Degree is required").max(160),
  fieldOfStudy: z.string().trim().max(160).optional(),
  location: z.string().trim().max(160).optional(),
  startDate: z.string().date().optional().or(z.literal("")),
  endDate: z.string().date().optional().or(z.literal("")),
  description: z.string().trim().max(5_000).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const certificateFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  issuer: z.string().trim().min(1, "Issuer is required").max(160),
  credentialUrl: optionalUrl,
  issueDate: z.string().date().optional().or(z.literal("")),
  description: z.string().trim().max(5_000).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const siteSettingsFormSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required").max(120),
  siteDescription: z.string().trim().max(320).optional(),
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
});

export const socialLinksSchema = z.object({
  facebookUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  xUrl: optionalUrl,
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  portfolioUrl: optionalUrl,
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type ExperienceFormData = z.infer<typeof experienceFormSchema>;
export type EducationFormData = z.infer<typeof educationFormSchema>;
export type CertificateFormData = z.infer<typeof certificateFormSchema>;
export type SiteSettingsFormData = z.infer<typeof siteSettingsFormSchema>;
export type SocialLinksFormData = z.infer<typeof socialLinksSchema>;
