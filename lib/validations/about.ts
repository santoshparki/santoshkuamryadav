import { z } from "zod";

export const aboutFormSchema = z.object({
  sectionTitle: z.string().optional(),
  sectionSubtitle: z.string().optional(),
  shortBio: z.string().optional(),
  longBio: z.string().optional(),
  readMoreButtonText: z.string().optional(),
  showLessButtonText: z.string().optional(),
});

export const aboutTagSchema = z.object({
  label: z.string().min(1, "Label is required"),
  icon: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});
