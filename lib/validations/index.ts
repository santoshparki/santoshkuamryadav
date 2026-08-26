/** Shared validation entry point. Model-specific schemas live in focused modules. */
import { z } from "zod";
import { projectFormSchema } from "./projects";
import { skillFormSchema } from "./skills";
import { certificateFormSchema, educationFormSchema, experienceFormSchema, serviceFormSchema, siteSettingsFormSchema, socialLinksSchema } from "./content";

export { aboutFormSchema, aboutTagSchema } from "./about";
export { heroFormSchema } from "./hero";
export { projectFormSchema } from "./projects";
export { skillCategoryFormSchema, skillFormSchema } from "./skills";
export { certificateFormSchema, educationFormSchema, experienceFormSchema, serviceFormSchema, siteSettingsFormSchema, socialLinksSchema } from "./content";
export { imageUploadSchema, paginationSchema } from "./shared";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(254, "Email is too long"),
  subject: z.string().trim().max(160, "Subject is too long").optional(),
  message: z.string().trim().min(1, "Message is required").max(5_000, "Message is too long"),
  phone: z.string().trim().max(40, "Phone number is too long").optional(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: z.string().trim().min(1, "Slug is required").max(160),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  coverImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
  seoKeywords: z.array(z.string().trim().min(1)).default([]),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(120),
  company: z.string().trim().max(120).optional(),
  photoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  review: z.string().trim().min(1, "Review is required").max(2_000),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const mediaUploadSchema = z.object({
  folder: z.string().trim().max(120).optional(),
  isPublic: z.boolean().default(true),
});

// Compatibility aliases for consumers that previously imported these names.
export const projectSchema = projectFormSchema;
export const skillSchema = skillFormSchema;
export const serviceSchema = serviceFormSchema;
export const experienceSchema = experienceFormSchema;
export const educationSchema = educationFormSchema;
export const certificateSchema = certificateFormSchema;

export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type SkillFormData = z.infer<typeof skillFormSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type ExperienceFormData = z.infer<typeof experienceFormSchema>;
export type EducationFormData = z.infer<typeof educationFormSchema>;
export type CertificateFormData = z.infer<typeof certificateFormSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SiteSettingsFormData = z.infer<typeof siteSettingsFormSchema>;
export type SocialLinksFormData = z.infer<typeof socialLinksSchema>;
export type MediaUploadFormData = z.infer<typeof mediaUploadSchema>;
