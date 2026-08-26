"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { About, AboutTag } from "@prisma/client";

type AboutWithTags = Partial<About> & { tags?: AboutTag[] };

export default function AboutSection({ about }: { about: AboutWithTags | null }) {
  const sectionTitle = about?.sectionTitle ?? "About";
  const sectionSubtitle = about?.sectionSubtitle ?? "Who I am";
  const shortBio = about?.shortBio ?? "A polished portfolio profile is ready to be published.";
  const longBio = about?.longBio ?? "";
  const readMoreText = about?.readMoreButtonText ?? "Know More About Me";
  const showLessText = about?.showLessButtonText ?? "Show Less";
  const activeTags = (about?.tags ?? [])
    .filter((tag) => tag.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="about"
      className="mx-auto mt-12 max-w-7xl rounded-[24px] border border-white/10 bg-[#111827]/80 bg-gradient-to-br from-[#111827]/90 via-[#0B1624]/80 to-[#111827]/90 bg-clip-padding p-8 shadow-2xl shadow-[#070B12]/40 backdrop-blur-xl transition-all duration-300 sm:p-10"
    >
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">{sectionTitle}</p>
          <h2 className="max-w-[760px] text-3xl font-semibold text-white sm:text-4xl">{sectionSubtitle}</h2>
        </div>

        <div className="space-y-7">
          <AnimatePresence initial={false}>
            {!expanded && shortBio ? (
              <motion.div
                key="about-short"
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 320 }}
                exit={{ opacity: 0, maxHeight: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/50 p-6 text-slate-100 shadow-sm shadow-slate-950/20"
              >
                <p className="text-base leading-8">{shortBio}</p>
              </motion.div>
            ) : null}

            {expanded && longBio ? (
              <motion.div
                key="about-long"
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 700 }}
                exit={{ opacity: 0, maxHeight: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/50 p-6 text-slate-100 shadow-sm shadow-slate-950/20"
              >
                <p className="text-base leading-8">{longBio}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {longBio ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2"
            >
              {expanded ? showLessText : readMoreText}
              <span className="text-base">→</span>
            </Button>
          ) : null}
        </div>

        {activeTags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {activeTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-2 rounded-full border border-[#0F172A]/80 bg-[#0D1624]/70 px-4 py-2 text-sm text-[#E2E8F0] transition duration-300 hover:-translate-y-0.5 hover:border-[#18E3E3] hover:bg-[#18E3E3]/10"
              >
                {tag.icon ? <span>{tag.icon}</span> : null}
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
