"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function handleMutationSuccess(path: string) {
  revalidatePath(path);
}

/** Refreshes cached anonymous portfolio data after a CMS mutation. */
export async function revalidatePublicPortfolio() {
  revalidateTag("portfolio-public", "max");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
