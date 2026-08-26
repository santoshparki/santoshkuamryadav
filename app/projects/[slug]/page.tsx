import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/project-gallery";
import Link from "next/link";
import { getPublicProjectBySlug } from "@/lib/supabase/public-data";

type ProjectImage = {
  url: string;
  caption?: string | null;
};

type ProjectDetailsProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProjectDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found", robots: { index: false, follow: false } };
  }

  const description = (project.description || project.shortDescription || `${project.title} portfolio project.`).slice(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = project.images[0]?.url;

  return {
    metadataBase: new URL(siteUrl),
    title: `${project.title} | Santosh Kumar Yadav`,
    description,
    keywords: [project.category, ...(project.technologies || [])].filter(Boolean) as string[],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `/projects/${project.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: project.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: project.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectDetailsProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const images: ProjectImage[] = project.images ?? [];

  return (
    <main className="portfolio-shell min-h-screen bg-[#070B12] px-6 py-16 text-[#CBD5E1] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-[1120px] rounded-[32px] border border-white/10 bg-[#07101b]/85 p-6 shadow-[0_40px_120px_rgba(3,12,28,0.35)] backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">Project details</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{project.title}</h1>
            {project.category ? <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{project.category}</p> : null}
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              ← Back to projects
            </Link>
          </div>
          {project.featured ? (
            <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              Featured Project
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07101b]/70 shadow-[0_24px_80px_rgba(3,12,28,0.28)]">
              <ProjectGallery images={images} title={project.title} />
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#0B1624]/80 p-6 shadow-[0_18px_60px_rgba(3,12,28,0.25)]">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Project Overview</h2>
                <p className="text-base leading-8 text-zinc-300">{project.description ?? project.shortDescription ?? "No project description available."}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {(project.technologies || []).map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 bg-[#0D1624]/90 px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-zinc-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    GitHub
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    Live Project
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#07101b]/80 p-6 shadow-[0_18px_60px_rgba(3,12,28,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Quick details</p>
              <div className="mt-5 space-y-4 text-sm text-zinc-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Short description</p>
                  <p className="mt-2 text-base text-zinc-200">{project.shortDescription ?? "No short description available."}</p>
                </div>
                {project.category ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Category</p>
                    <p className="mt-2 text-base text-zinc-200">{project.category}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Status</p>
                  <p className="mt-2 text-base text-zinc-200">Published</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#07101b]/80 p-6 shadow-[0_18px_60px_rgba(3,12,28,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Project images</p>
              <div className="mt-4 grid gap-3">
                {images.length > 0 ? (
                  images.slice(0, 4).map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1624]/80">
                      <p className="p-3 text-xs text-zinc-300">{index + 1}. {image.caption ?? "Project image"}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-[#0B1624]/80 p-4 text-sm text-zinc-400">No project images available.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
