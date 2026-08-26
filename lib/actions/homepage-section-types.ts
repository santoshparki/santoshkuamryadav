export const homepageSectionKeys = [
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certificates",
  "services",
  "contact",
] as const;

export type HomepageSectionKey = (typeof homepageSectionKeys)[number];

export type HomepageSectionRecord = {
  key: string;
  isVisible: boolean;
  sortOrder: number;
  title: string | null;
  description: string | null;
};