"use client";

import { motion } from "framer-motion";

const shorts = [
  { id: "8BXNCR2GuJ4", label: "Client Testimonial", tag: "Review" },
  { id: "DgAOQZXSetk", label: "PanSafe Kitchen Fire", tag: "PanSafe" },
  { id: "oIspMHiZ1WM", label: "FireKiller in Action", tag: "FireKiller" },
  { id: "lRxesFqSU0U", label: "PanSafe Demo", tag: "PanSafe" },
];

export default function YouTubeShortsSection() {
  return (
    <section className="py-10 lg:py-14 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Shorts
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary">
            Seen on Social
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Real demos, real reviews — watch how our products perform in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {shorts.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex flex-col gap-2"
            >
              <div className="relative aspect-9/16 rounded-2xl overflow-hidden border border-border shadow-sm bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${s.id}?rel=0&modestbranding=1`}
                  title={s.label}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-medium text-secondary">{s.label}</p>
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">
                  {s.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
