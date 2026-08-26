"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, AtSign, BriefcaseBusiness, Camera, Code2, FileText, Globe2, Play, Users } from "lucide-react";
import type { Hero as HeroRecord } from "@prisma/client";

type HeroData = Partial<
  Pick<
    HeroRecord,
    | "fullName"
    | "professionalTitle"
    | "headline"
    | "heading"
    | "subheadline"
    | "subHeading"
    | "resumeUrl"
    | "primaryButtonText"
    | "ctaLabel"
    | "secondaryButtonText"
    | "backgroundImageUrl"
    | "heroImageUrl"
  >
> & {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  xUrl?: string | null;
};

type HeroProps = {
  heroData?: HeroData | null;
  socialLinks?: string[];
  projectsCount?: number;
  experienceYears?: number;
  clientsCount?: number;
};

function getSocialDetails(url: string) {
  const hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  if (hostname.includes("github")) return { label: "GitHub", Icon: Code2 };
  if (hostname.includes("linkedin")) return { label: "LinkedIn", Icon: BriefcaseBusiness };
  if (hostname.includes("instagram")) return { label: "Instagram", Icon: Camera };
  if (hostname.includes("youtube")) return { label: "YouTube", Icon: Play };
  if (hostname.includes("facebook")) return { label: "Facebook", Icon: Users };
  if (hostname.includes("twitter") || hostname.includes("x.com")) return { label: "X", Icon: AtSign };
  return { label: hostname, Icon: Globe2 };
}

export default function Hero({ heroData, socialLinks = [], projectsCount = 0 }: HeroProps) {
  const name = heroData?.fullName ?? "Your Name";
  const title = heroData?.professionalTitle ?? "Engineering Leader";
  const heading = heroData?.headline ?? heroData?.heading ?? "Engineering premium digital products with precision and polish.";
  const intro = heroData?.subheadline ?? heroData?.subHeading ?? "Engineering robust, scalable systems with attention to performance, reliability, and real-world impact.";
  const resumeUrl = heroData?.resumeUrl ?? "/resume.pdf";
  const primaryLabel = heroData?.primaryButtonText ?? heroData?.ctaLabel ?? "View Projects";
  const secondaryLabel = heroData?.secondaryButtonText ?? "Contact Me";

  const socials = (socialLinks.length > 0
    ? socialLinks
    : [heroData?.githubUrl, heroData?.linkedinUrl, heroData?.xUrl].filter(Boolean)
  ).flatMap((url) => {
    try {
      return url ? [{ url, ...getSocialDetails(url) }] : [];
    } catch {
      return [];
    }
  });

  return (
    <section className="relative isolate -mx-6 -mt-16 min-h-[calc(100svh-2rem)] overflow-hidden border-b border-white/10 bg-[#07111f] px-6 pb-20 pt-36 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
      {/* Background decorative layers: hero background image, blueprint grid, circuit lines, waves, dotted patterns */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {heroData?.backgroundImageUrl ? (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image src={heroData.backgroundImageUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-70 contrast-[1.05] brightness-[0.65]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07111F]/95 via-[#07111F]/72 to-[#07111F]/35" />
          </div>
        ) : null}
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 1200 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#0fb9a0" strokeWidth="0.6" opacity="0.08">
            {/* circuit-like lines */}
            <path d="M40 520 C160 420 300 460 420 380 C540 300 680 340 820 260 C920 200 1040 260 1160 220" strokeLinecap="round" />
            <path d="M60 420 C180 340 320 380 460 300 C580 230 720 270 860 200" strokeLinecap="round" />
          </g>
          <g fill="none" stroke="#0fb9a0" strokeWidth="0.4" opacity="0.04">
            {/* abstract wave lines */}
            <path d="M0 100 Q200 60 400 100 T800 100 T1200 100" />
            <path d="M0 160 Q220 120 440 160 T880 160 T1200 160" />
          </g>
        </svg>
        <div className="absolute inset-0 dotted-pattern opacity-10" />
        <div className="absolute inset-0 bg-radial-gradient opacity-18 mix-blend-overlay" />
      </div>

      <div id="hero" className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-7xl items-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="flex max-w-3xl flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_#34d399]" /> Available for selected work
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/80">{title}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              <span className="block text-white/72">{name}</span>
              <span className="mt-3 block h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-300 via-teal-300 to-transparent" />
            </h1>

            <h2 className="max-w-2xl text-xl font-medium leading-snug text-cyan-50 sm:text-2xl">{heading}</h2>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{intro}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" className="group relative inline-flex items-center gap-3 overflow-visible">
                <Link href="#projects" className="inline-flex items-center gap-3">
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  <span className="relative z-10">{primaryLabel}</span>
                </Link>
              </Button>

              <Button asChild variant="secondary">
                <Link href="#contact">{secondaryLabel}</Link>
              </Button>

              <Button asChild variant="ghost" className="inline-flex items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm text-white/90 transition hover:-translate-y-0.5 hover:shadow-md">
                <a href={resumeUrl} target="_blank" rel="noreferrer"><FileText aria-hidden="true" className="h-4 w-4" /> Resume</a>
              </Button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/6 p-2 text-zinc-200 transition hover:-translate-y-0.5 hover:bg-cyan-300/15 hover:text-cyan-100">
                  <s.Icon aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }} className="relative flex items-center justify-center">
            <div className="relative mx-auto w-[320px] sm:w-[410px] lg:w-[460px]">
              {/* dotted arc behind portrait */}
              <svg className="absolute -left-10 -top-12 h-[420px] w-[420px] rotate-6 opacity-30" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="210" cy="210" r="180" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.7" />
              </svg>

              {/* rotated backing card for layered effect */}
              <div className="absolute -right-6 -bottom-6 -z-10 h-[460px] w-[320px] rounded-2xl bg-white/3 transform rotate-3 blur-[2px]" />

              {/* neon glow behind */}
              <div className="absolute -inset-3 -z-20 rounded-3xl blur-3xl opacity-40 bg-gradient-to-r from-teal-500/60 to-teal-300/30" />

              {/* glass frame */}
              <div className="relative overflow-hidden rounded-3xl bg-white/5 p-3 backdrop-blur-lg neon-border">
                {heroData?.heroImageUrl ? (
                  <div className="relative h-[460px] w-full">
                    <Image src={heroData.heroImageUrl} alt={name} fill priority sizes="(max-width: 640px) 320px, (max-width: 1024px) 410px, 460px" className="rounded-2xl object-cover object-center neon-stroke" />
                  </div>
                ) : (
                  <div className="flex h-[460px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 text-zinc-300">
                    <div className="text-center">
                      <p className="text-2xl font-semibold">{name}</p>
                      <p className="mt-2 text-sm text-zinc-400">{title}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-[#091521]/85 px-5 py-4 shadow-2xl backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">{projectsCount}+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Projects</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
