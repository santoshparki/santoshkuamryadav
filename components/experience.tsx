"use client";
import { motion } from "framer-motion";
import type { Experience } from "@prisma/client";

export default function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <section id="experience" className="mx-auto mt-12 max-w-1280">
      <div className="section-heading">
        <div className="heading-icon">💼</div>
        <div>
          <div className="text-xs">EXPERIENCE</div>
          <div className="heading-underline" />
        </div>
      </div>

      <div className="mt-6 relative">
        <div className="absolute left-6 top-6 h-full w-0.5 bg-[#18E3E3]/15" />
        <div className="space-y-8 pl-12">
          {(!items || items.length === 0) ? (
            <div className="section-card">No professional experience added yet.</div>
          ) : (
            items.map((it) => (
              <motion.div key={it.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="absolute left-[-36px] top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#0D1624]/90 text-sm font-semibold text-[#E2E8F0]">{new Date(it.startDate || it.createdAt).getFullYear()}</div>
                <div className="section-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{it.position} · {it.company}</p>
                      <p className="text-sm text-[#CBD5E1]">{it.location}</p>
                    </div>
                    <div className="text-sm text-[#CBD5E1]">{it.isCurrent ? 'Present' : `${it.startDate ? new Date(it.startDate).getFullYear() : ''} - ${it.endDate ? new Date(it.endDate).getFullYear() : ''}`}</div>
                  </div>
                  {it.description ? <p className="mt-2 text-sm text-zinc-300">{it.description}</p> : null}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
