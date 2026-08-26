"use client";
import { motion } from "framer-motion";
import type { Service } from "@prisma/client";

type ServiceWithPrice = Service & { price?: string | null };

export default function ServicesList({ services }: { services: ServiceWithPrice[] }) {
  return (
    <section id="services" className="mx-auto mt-12 max-w-6xl animate-fade-in-up-delay">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Services</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(services || []).map((s) => (
          <motion.div key={s.id} whileHover={{ y: -6 }} className="section-card text-[#CBD5E1]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              {s.price ? <div className="text-sm font-semibold text-[#18E3E3]">{s.price}</div> : null}
            </div>
            <p className="mt-3 text-sm text-[#CBD5E1]">{s.description}</p>
            {Array.isArray(s.features) && s.features.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {s.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-emerald-300">•</span> {f}</li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
