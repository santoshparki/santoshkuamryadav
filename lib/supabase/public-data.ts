import type {
  About,
  AboutTag,
  Certificate,
  Education,
  Experience,
  Project,
  ProjectImage,
  Service,
  SiteSetting,
  Skill,
  SkillCategory,
  SocialLink,
} from "@prisma/client";
import { getSupabasePublicEnv } from "@/lib/env";
import { homepageSectionKeys } from "@/lib/actions/homepage-section-types";

const PUBLIC_DATA_REVALIDATE_SECONDS = 300;
const PUBLIC_DATA_TAG = "portfolio-public";

type HeroRow = {
  fullName?: string | null;
  professionalTitle?: string | null;
  headline?: string | null;
  heading?: string | null;
  subheadline?: string | null;
  subHeading?: string | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  backgroundImageUrl?: string | null;
  heroImageUrl?: string | null;
  enableResumeDownload?: boolean | null;
  resumeUrl?: string | null;
  resumeButtonText?: string | null;
  showSocialLinks?: boolean | null;
  showAvailabilityBadge?: boolean | null;
  availabilityStatus?: string | null;
  location?: string | null;
  yearsOfExperience?: number | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  resumeButtonLabel?: string | null;
  resumeButtonHref?: string | null;
};

type PublicRow = Record<string, unknown>;

type PublicHomepageData = {
  hero: HeroRow | null;
  about: (About & { tags: AboutTag[] }) | null;
  socialLink: SocialLink | null;
  skills: (Skill & { category: SkillCategory | null })[];
  projects: (Project & { images: ProjectImage[] })[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
  services: Service[];
  siteSettings: SiteSetting | null;
  homepageSections: { key: string; isVisible: boolean; sortOrder: number; title: string | null; description: string | null }[];
};

async function getPublicTable(table: string, query = "select=*"): Promise<PublicRow[]> {
  try {
    const { url, anonKey } = getSupabasePublicEnv();
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      next: {
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        tags: [PUBLIC_DATA_TAG, `portfolio-public-${table}`],
      },
    });

    if (!response.ok) return [];
    return (await response.json()) as PublicRow[];
  } catch {
    return [];
  }
}

export async function getPublicHero(): Promise<HeroRow | null> {
  const rows = await getPublicTable("hero", "select=*&limit=1");
  return (rows[0] as HeroRow | undefined) ?? null;
}

export async function getPublicHomepageData(): Promise<PublicHomepageData> {
  const [hero, aboutRows, aboutTags, categories, skills, projectRows, projectImages, experiences, education, certificates, services, socialLinks, siteSettings, homepageSections] = await Promise.all([
    getPublicHero(),
    getPublicTable("about", "select=*&limit=1"),
    getPublicTable("about_tags", "select=*&order=displayOrder.asc"),
    getPublicTable("skill_categories", "select=*&order=sortOrder.asc"),
    getPublicTable("skills", "select=*&order=sortOrder.asc,createdAt.desc"),
    getPublicTable("projects", "select=*&status=eq.PUBLISHED&order=featured.desc,createdAt.desc"),
    getPublicTable("project_images", "select=*&order=sortOrder.asc"),
    getPublicTable("experiences", "select=*&order=sortOrder.asc,startDate.desc"),
    getPublicTable("education", "select=*&order=sortOrder.asc,startDate.desc"),
    getPublicTable("certificates", "select=*&order=sortOrder.asc,issueDate.desc"),
    getPublicTable("services", "select=*&order=displayOrder.asc,createdAt.desc"),
    getPublicTable("social_links", "select=*&limit=1"),
    getPublicTable("site_settings", "select=*&limit=1"),
    getPublicTable("homepage_sections", "select=*")
  ]);

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const imagesByProjectId = new Map<string, PublicRow[]>();
  for (const image of projectImages) {
    const images = imagesByProjectId.get(String(image.projectId)) ?? [];
    images.push(image);
    imagesByProjectId.set(String(image.projectId), images);
  }

  const savedSections = new Map(homepageSections.map((section) => [String(section.key), section]));
  const allSections = [
    ...homepageSectionKeys.map((key, index) => savedSections.get(key) ?? {
      key,
      isVisible: true,
      sortOrder: (index + 1) * 10,
      title: null,
      description: null,
    }),
    ...homepageSections.filter((section) => !homepageSectionKeys.includes(section.key as (typeof homepageSectionKeys)[number])),
  ];

  return {
    hero,
    about: aboutRows[0] ? ({ ...aboutRows[0], tags: aboutTags } as unknown as About & { tags: AboutTag[] }) : null,
    socialLink: (socialLinks[0] as unknown as SocialLink | undefined) ?? null,
    skills: skills.map((skill) => ({ ...skill, category: categoryById.get(skill.categoryId as string) ?? null })) as unknown as (Skill & { category: SkillCategory | null })[],
    projects: projectRows.map((project) => ({ ...project, images: imagesByProjectId.get(String(project.id)) ?? [] })) as unknown as (Project & { images: ProjectImage[] })[],
    experiences: experiences as unknown as Experience[],
    education: education as unknown as Education[],
    certificates: certificates as unknown as Certificate[],
    services: services as unknown as Service[],
    siteSettings: (siteSettings[0] as unknown as SiteSetting | undefined) ?? null,
    homepageSections: allSections as unknown as { key: string; isVisible: boolean; sortOrder: number; title: string | null; description: string | null }[],
  };
}

export async function getPublicSiteSettings(): Promise<Pick<SiteSetting, "siteTitle" | "seoTitle" | "seoDescription" | "logoUrl"> | null> {
  const rows = await getPublicTable("site_settings", "select=siteTitle,seoTitle,seoDescription,logoUrl&limit=1");
  return (rows[0] as unknown as Pick<SiteSetting, "siteTitle" | "seoTitle" | "seoDescription" | "logoUrl"> | undefined) ?? null;
}

export async function getPublicProjectSlugs(): Promise<string[]> {
  const rows = await getPublicTable("projects", "select=slug&status=eq.PUBLISHED");
  return rows.map((row) => String(row.slug)).filter(Boolean);
}

export async function getPublicProjectBySlug(slug: string): Promise<(Project & { images: ProjectImage[] }) | null> {
  const rows = await getPublicTable(
    "projects",
    `select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.PUBLISHED&limit=1`
  );
  const project = rows[0];
  if (!project) return null;

  const images = await getPublicTable(
    "project_images",
    `select=*&projectId=eq.${encodeURIComponent(String(project.id))}&order=sortOrder.asc`
  );

  return { ...project, images } as unknown as Project & { images: ProjectImage[] };
}
