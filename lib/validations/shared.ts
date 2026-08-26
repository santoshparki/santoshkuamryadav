import { z } from "zod";

export const imageUploadSchema = z.object({
  file: z.instanceof(File, { message: "Please select a file" }),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().optional(),
});
