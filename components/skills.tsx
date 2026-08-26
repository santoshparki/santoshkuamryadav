"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { Skill, SkillCategory } from "@prisma/client";

type SkillWithCategory = Skill & { category: SkillCategory | null; categoryName?: string | null };

export default function Skills({ skills }: { skills: SkillWithCategory[] }) {
  const grouped: Record<string, SkillWithCategory[]> = {};
  (skills || []).forEach((s) => {
    const cat = s.category?.name ?? s.categoryName ?? "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  return (
    <section id="skills" className="mx-auto mt-12 max-w-1280">
      <div className="flex items-center justify-between">
        <div>
          <div className="section-heading">
            <div className="heading-icon"><Zap aria-hidden="true" className="h-5 w-5" /></div>
            <div>
              <div className="text-xs">SKILLS</div>
              <div className="heading-underline" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="section-card">
            <p className="text-sm font-medium text-[#CBD5E1]">{cat}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {items.map((skill) => (
                <motion.button key={skill.id} whileHover={{ scale: 1.03 }} className="skill-chip" aria-label={skill.name}>
                  <span className="text-sm font-semibold text-white">{skill.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
