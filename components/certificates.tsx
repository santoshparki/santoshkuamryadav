"use client";
import { motion } from "framer-motion";
import type { Certificate } from "@prisma/client";

export default function CertificatesGrid({ certificates }: { certificates: Certificate[] }) {
  return (
    <section id="certificates" className="mx-auto mt-12 max-w-1280">
      <div className="section-heading">
        <div className="heading-icon">🏆</div>
        <div>
          <div className="text-xs">CERTIFICATES</div>
          <div className="heading-underline" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(certificates || []).length === 0 ? (
          <div className="section-card flex items-center gap-4">
            <div className="text-3xl">📜</div>
            <div>
              <h3 className="text-lg font-semibold text-white">No certificates yet</h3>
              <p className="text-sm text-zinc-300">Upload certificates from the admin to showcase your credentials.</p>
            </div>
          </div>
        ) : (
          (certificates || []).map((c) => (
            <motion.a key={c.id} whileHover={{ y: -6 }} href={c.credentialUrl ?? '#'} target="_blank" rel="noreferrer" className="section-card flex flex-col gap-3 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-xs text-zinc-400">{c.issuer}</p>
                </div>
                <div className="text-xs text-zinc-400">{c.issueDate ? new Date(c.issueDate).getFullYear() : ''}</div>
              </div>
              {c.description ? <p className="text-sm text-zinc-300">{c.description}</p> : null}
            </motion.a>
          ))
        )}
      </div>
    </section>
  );
}
