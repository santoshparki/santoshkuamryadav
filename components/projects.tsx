"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FolderKanban, PackageOpen } from "lucide-react";

type ProjectImage = {
  url: string;
  caption?: string | null;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  featured?: boolean;
  images?: ProjectImage[];
  shortDescription?: string | null;
  description?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies?: string[] | null;
};

function TechBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-[#0D1624]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300 transition hover:border-cyan-300/40 hover:text-cyan-100">
      {name}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const images = project.images || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeImage = images[activeIndex] ?? { url: "/placeholder-project.jpg", caption: null };
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasCarousel = images.length > 1;
  const summaryText = project.shortDescription ?? (project.description ? `${project.description.slice(0, 120)}${project.description.length > 120 ? "..." : ""}` : "Project overview");
  const fullDescription = project.description ?? "";
  const canExpand = !!project.description && project.description.trim().length > summaryText.trim().length;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group flex h-full flex-col overflow-hidden rounded-[28px] border bg-[#07101b]/90 shadow-[0_22px_85px_rgba(3,12,28,0.35)] transition duration-300 hover:-translate-y-0.5 ${project.featured ? "border-cyan-400/20 shadow-[0_26px_90px_rgba(24,227,227,0.18)]" : "border-white/10"}`}
    >
      <div className="relative h-[280px] overflow-hidden rounded-t-[28px] sm:h-[340px]">
        {failedImageUrl !== activeImage.url ? (
          <Image
            src={activeImage.url}
            alt={activeImage.caption ?? project.title}
            fill
            unoptimized
            onError={() => setFailedImageUrl(activeImage.url)}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="absolute inset-0 z-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#112337] px-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Project image unavailable
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90" />

        {project.featured ? (
          <div className="absolute top-4 left-4 rounded-full border border-cyan-400/35 bg-[#0C253B]/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-100 shadow-sm shadow-cyan-500/10">
            Featured
          </div>
        ) : null}

        {!images.length ? (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white">
            <div>
              <div>No project image available.</div>
            </div>
          </div>
        ) : null}

        {hasCarousel ? (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={() => setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1))}
              aria-label={`Show previous image for ${project.title}`}
              className="rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/70"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1))}
              aria-label={`Show next image for ${project.title}`}
              className="rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/70"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-white">{project.title}</h3>
          <p className="text-sm leading-7 text-zinc-300">{summaryText}</p>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).slice(0, 6).map((t: string) => (
                <TechBadge key={t} name={t} />
              ))}
            </div>

            {canExpand ? (
              <button
                type="button"
                onClick={() => setIsExpanded((current) => !current)}
                aria-expanded={isExpanded}
                className="text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
              >
                {isExpanded ? "Hide details" : "Read more"}
              </button>
            ) : null}

            {isExpanded ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-300">
                {fullDescription}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between sm:border-t-0 sm:pt-0">
            <div className="flex flex-wrap gap-2">
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10 hover:border-cyan-400/25">
                  Code
                </a>
              ) : null}
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10 hover:border-cyan-400/25">
                  Demo
                </a>
              ) : null}
            </div>
            <Link href={`/projects/${project.slug}`} className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15">
              View Project Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set((projects || []).map((project) => project.category).filter(Boolean) as string[]))];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProjects = (projects || []).filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const searchableText = [project.title, project.category, project.shortDescription, project.description, ...(project.technologies || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  return (
    <section id="projects" className="mx-auto mt-12 max-w-[1280px] animate-fade-in-up">
      <div className="flex flex-col gap-4">
        <div className="section-heading">
          <div className="heading-icon"><FolderKanban aria-hidden="true" className="h-5 w-5" /></div>
          <div>
            <div className="text-xs">PROJECTS</div>
            <div className="heading-underline" />
          </div>
        </div>
        <div className="max-w-3xl text-sm leading-7 text-zinc-300">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Selected projects built for real impact.</h2>
          <p className="mt-3">A curated collection of recent work with polished design, technical depth, and production-ready execution.</p>
        </div>
      </div>

      {(projects || []).length > 0 ? (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search projects"
            className="input-glass w-full sm:max-w-sm"
          />
          {categories.length > 1 ? (
            <div className="flex flex-wrap gap-2" aria-label="Filter projects by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-300/30 hover:text-cyan-100"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8">
        {(projects || []).length === 0 ? (
          <div className="section-card flex flex-col items-start gap-4 rounded-[28px] border border-white/10 bg-[#0B1624]/90 p-8 shadow-[0_20px_70px_rgba(3,12,28,0.35)]">
            <div className="icon-tile h-12 w-12"><PackageOpen aria-hidden="true" className="h-5 w-5" /></div>
            <div>
              <h3 className="text-2xl font-semibold text-white">No projects yet</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-300">The portfolio is ready for your latest work. Add published projects in the admin panel to showcase them here.</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="section-card p-8 text-sm text-zinc-300">No projects match your search.</div>
        ) : filteredProjects.length === 1 ? (
          <div className="mx-auto w-full max-w-[920px]">
            <ProjectCard project={filteredProjects[0]} />
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
