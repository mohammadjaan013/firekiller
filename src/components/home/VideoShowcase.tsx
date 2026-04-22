"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoShowcase() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Featured
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary">
            PanSafe × Vishnu Manohar
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Watch how India&apos;s favourite kitchen fire safety sachet performs
            in a real kitchen — endorsed by Vishnu Manohar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-md bg-black">
            {playing ? (
              <iframe
                src="https://www.youtube.com/embed/cF5OFvxHTi0?rel=0&modestbranding=1&autoplay=1"
                title="PanSafe × Vishnu Manohar"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full group"
                aria-label="Play PanSafe × Vishnu Manohar video"
              >
                <Image
                  src="/images/brand/thumbnail.png"
                  alt="PanSafe × Vishnu Manohar thumbnail"
                  fill
                  className="object-cover"
                  priority
                />
                {/* dark overlay on hover */}
                <span className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
                {/* play button — small triangle only, bottom-right corner */}
                <span className="absolute bottom-4 right-4">
                  <svg
                    className="w-8 h-8 drop-shadow-lg"
                    viewBox="0 0 24 24"
                    fill="white"
                    style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/shop/pansafe-1"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
            >
              Shop PanSafe <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
