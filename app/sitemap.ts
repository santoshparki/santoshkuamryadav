import type { MetadataRoute } from "next";
import { getPublicProjectSlugs } from "@/lib/supabase/public-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const slugs = await getPublicProjectSlugs();

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}