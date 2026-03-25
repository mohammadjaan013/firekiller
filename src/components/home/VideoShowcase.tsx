"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

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
            in a real kitchen — endorsed by a Vishnu Manohar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-md">
            {/* Thumbnail overlay */}
            {!playing && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group"
                aria-label="Play video"
              >
                <Image
                  src="/images/brand/thumbnail.png"
                  alt="PanSafe Vishnu Manohar"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <svg
                  className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
            <video
              ref={videoRef}
              src="/videos/pansafe-advt.mp4"
              controls={playing}
              preload="metadata"
              playsInline
              onEnded={() => setPlaying(false)}
              className="w-full h-full object-cover"
            />
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
