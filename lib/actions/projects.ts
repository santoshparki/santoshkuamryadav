"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma, withDbFallback } from "@/lib/prisma";
import { projectFormSchema } from "@/lib/validations/projects";
import { uploadFileToStorage, getPublicUrl } from "@/lib/actions/storage";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

export async function listProjects(search?: string) {
  return withDbFallback(
    () =>
      prisma.project.findMany({
        where: search
          ? {
              OR: [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }],
            }
          : undefined,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    [],
  );
}

export async function createProject(input: z.infer<typeof projectFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = projectFormSchema.parse(input);
  const project = await prisma.project.create({
    data: {
      ...parsed,
      technologies: parsed.technologies?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    },
  });
  revalidatePath("/admin/projects");
  return project;
}

export async function updateProject(id: string, input: z.infer<typeof projectFormSchema>) {
  await requireAuthenticatedUser();
  const parsed = projectFormSchema.parse(input);
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...parsed,
      technologies: parsed.technologies?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    },
  });
  revalidatePath("/admin/projects");
  return project;
}

export async function deleteProject(id: string) {
  await requireAuthenticatedUser();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
}

export async function uploadProjectImage(projectId: string, file: File) {
  await requireAuthenticatedUser();
  const path = `projects/${projectId}/${Date.now()}-${file.name}`;
  const storedPath = await uploadFileToStorage(file, "portfolio-assets", path);
  const publicUrl = await getPublicUrl("portfolio-assets", storedPath as string);

  const maxSortOrder = await prisma.projectImage.aggregate({
    _max: {
      sortOrder: true,
    },
    where: { projectId },
  });

  const projectImage = await prisma.projectImage.create({
    data: {
      projectId,
      url: publicUrl,
      sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/projects");
  return projectImage;
}

export async function deleteProjectImage(id: string) {
  await requireAuthenticatedUser();
  await prisma.projectImage.delete({ where: { id } });
  revalidatePath("/admin/projects");
}

export async function replaceProjectImage(imageId: string, file: File) {
  await requireAuthenticatedUser();
  const path = `projects/replacements/${imageId}-${Date.now()}-${file.name}`;
  const storedPath = await uploadFileToStorage(file, "portfolio-assets", path);
  const publicUrl = await getPublicUrl("portfolio-assets", storedPath as string);

  const image = await prisma.projectImage.update({
    where: { id: imageId },
    data: { url: publicUrl },
  });

  revalidatePath("/admin/projects");
  return image;
}

export async function updateProjectImageAltText(imageId: string, altText: string) {
  await requireAuthenticatedUser();
  const image = await prisma.projectImage.update({
    where: { id: imageId },
    data: { caption: altText || null },
  });

  revalidatePath("/admin/projects");
  return image;
}

export async function reorderProjectImages(projectId: string, orderedImageIds: string[]) {
  await requireAuthenticatedUser();
  await Promise.all(
    orderedImageIds.map((imageId, index) =>
      prisma.projectImage.update({
        where: { id: imageId },
        data: { sortOrder: index },
      }),
    ),
  );

  revalidatePath("/admin/projects");
}
