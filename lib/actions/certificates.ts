"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { certificateFormSchema, type CertificateFormData } from "@/lib/validations/content";

export async function listCertificates() {
  return prisma.certificate.findMany({ orderBy: [{ sortOrder: "asc" }, { issueDate: "desc" }] });
}

export async function createCertificate(input: CertificateFormData) {
  await requireAuthenticatedUser();
  const parsed = certificateFormSchema.parse(input);
  const record = await prisma.certificate.create({
    data: {
      ...parsed,
      issueDate: parsed.issueDate ? new Date(parsed.issueDate) : null,
    },
  });
  revalidatePath("/admin/certificates");
  return record;
}

export async function updateCertificate(id: string, input: CertificateFormData) {
  await requireAuthenticatedUser();
  const parsed = certificateFormSchema.parse(input);
  const record = await prisma.certificate.update({
    where: { id },
    data: {
      ...parsed,
      issueDate: parsed.issueDate ? new Date(parsed.issueDate) : null,
    },
  });
  revalidatePath("/admin/certificates");
  return record;
}

export async function deleteCertificate(id: string) {
  await requireAuthenticatedUser();
  await prisma.certificate.delete({ where: { id } });
  revalidatePath("/admin/certificates");
}
