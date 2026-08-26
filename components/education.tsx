"use client";
import { motion } from "framer-motion";
import type { Education } from "@prisma/client";

export default function EducationTimeline({ items }: { items: Education[] }) {
  return (
    <section id="education" className="mx-auto mt-12 max-w-1280">
      <div className="section-heading">
        <div className="heading-icon">🎓</div>
        <div>
          <div className="text-xs">EDUCATION</div>
          <div className="heading-underline" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(!items || items.length === 0) ? (
          <div className="section-card text-[#CBD5E1]">No education records added yet.</div>
        ) : (
          items.map((it) => (
            <motion.div key={it.id} whileHover={{ y: -4 }} className="section-card" initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{it.degree}</p>
                  <p className="text-sm text-[#CBD5E1]">{it.institution}</p>
                </div>
                <div className="text-sm text-[#CBD5E1]">{`${it.startDate ? new Date(it.startDate).getFullYear() : ''} - ${it.endDate ? new Date(it.endDate).getFullYear() : ''}`}</div>
              </div>
              {it.fieldOfStudy ? <p className="mt-2 text-sm text-[#CBD5E1]">{it.fieldOfStudy}</p> : null}
              {it.description ? <p className="mt-3 text-sm text-[#CBD5E1]">{it.description}</p> : null}
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
