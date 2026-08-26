import { prisma, withDbFallback } from "@/lib/prisma";
import { PageHeader } from "@/components/common/page-header";
import { HeroForm } from "@/features/admin/hero/hero-form";

export default async function HeroPage() {
  const hero = await withDbFallback(() => prisma.hero.findFirst(), null);
  const heroData = hero
    ? {
        fullName: (hero as { fullName?: string | null }).fullName ?? null,
        professionalTitle: (hero as { professionalTitle?: string | null }).professionalTitle ?? null,
        headline: (hero as { headline?: string | null }).headline ?? (hero as { heading?: string | null }).heading ?? null,
        subheadline: (hero as { subheadline?: string | null }).subheadline ?? (hero as { subHeading?: string | null }).subHeading ?? null,
        primaryButtonText: (hero as { primaryButtonText?: string | null }).primaryButtonText ?? (hero as { ctaLabel?: string | null }).ctaLabel ?? null,
        primaryButtonUrl: (hero as { primaryButtonUrl?: string | null }).primaryButtonUrl ?? (hero as { ctaHref?: string | null }).ctaHref ?? null,
        secondaryButtonText: (hero as { secondaryButtonText?: string | null }).secondaryButtonText ?? null,
        secondaryButtonUrl: (hero as { secondaryButtonUrl?: string | null }).secondaryButtonUrl ?? null,
        enableResumeDownload: (hero as { enableResumeDownload?: boolean | null }).enableResumeDownload ?? false,
        resumeUrl: (hero as { resumeUrl?: string | null }).resumeUrl ?? null,
        resumeFileName: (hero as { resumeFileName?: string | null }).resumeFileName ?? null,
        resumeButtonText: (hero as { resumeButtonText?: string | null }).resumeButtonText ?? (hero as { resumeButtonLabel?: string | null }).resumeButtonLabel ?? null,
        showSocialLinks: (hero as { showSocialLinks?: boolean | null }).showSocialLinks ?? false,
        showAvailabilityBadge: (hero as { showAvailabilityBadge?: boolean | null }).showAvailabilityBadge ?? false,
        availabilityStatus: (hero as { availabilityStatus?: string | null }).availabilityStatus ?? null,
        location: (hero as { location?: string | null }).location ?? null,
        yearsOfExperience: (hero as { yearsOfExperience?: number | null }).yearsOfExperience ?? null,
        heading: (hero as { heading?: string | null }).heading ?? null,
        subHeading: (hero as { subHeading?: string | null }).subHeading ?? null,
        ctaLabel: (hero as { ctaLabel?: string | null }).ctaLabel ?? null,
        ctaHref: (hero as { ctaHref?: string | null }).ctaHref ?? null,
        resumeButtonLabel: (hero as { resumeButtonLabel?: string | null }).resumeButtonLabel ?? null,
        resumeButtonHref: (hero as { resumeButtonHref?: string | null }).resumeButtonHref ?? null,
        backgroundImageUrl: (hero as { backgroundImageUrl?: string | null }).backgroundImageUrl ?? null,
        heroImageUrl: (hero as { heroImageUrl?: string | null }).heroImageUrl ?? null,
      }
    : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Hero" description="Edit the hero section content and visuals for the homepage." />

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <HeroForm hero={heroData} />
      </div>
    </div>
  );
}
