"use client";

import { motion } from "framer-motion";

export default function CustomSection({ section }: { section: { key: string; title: string; description: string } }) {
  return (
    <section id={section.key} className="mx-auto mt-12 max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-card mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">More about me</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{section.title}</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-300">{section.description}</p>
      </motion.div>
    </section>
  );
}
