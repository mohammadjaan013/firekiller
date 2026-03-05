"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center text-center lg:text-left">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 mx-auto lg:mx-0"
            >
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                ISI-Certified Fire Safety
              </span>
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
              Seconds
              <br />
              <span className="text-primary">save lives.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0">
              Compact fire extinguishers that anyone can use. No training, no maintenance — just pull and spray.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Protect Your Home
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 text-foreground font-semibold rounded-full border border-border hover:border-primary hover:text-primary transition-all bg-surface/50 backdrop-blur-sm"
              >
                See How It Works
              </Link>
            </div>

            {/* Social Proof Micro */}
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["RK", "PS", "AP", "SK"].map((initials, i) => (
                  <div
                    key={initials}
                    className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">12,400+ homes protected</p>
                <p className="text-xs text-muted-foreground">Across India</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Floating Products */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative flex items-end justify-center gap-6 lg:gap-8"
          >
            {/* Extinguisher */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              className="relative"
            >
              <Image
                src="/images/hero/extinguisher.png"
                alt="FireKiller Extinguisher"
                width={1200}
                height={2000}
                className="h-80 sm:h-96 md:h-110 w-auto object-contain drop-shadow-[0_20px_50px_rgba(204,31,31,0.35)]"
                priority
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/20 rounded-full blur-2xl" />
            </motion.div>

            {/* Sachet */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
              className="relative self-center"
            >
              <Image
                src="/images/hero/sachet.png"
                alt="PanSafe Sachet"
                width={200}
                height={300}
                className="h-52 sm:h-60 md:h-72 w-auto object-contain drop-shadow-[0_20px_50px_rgba(204,31,31,0.35)]"
                priority
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-primary/20 rounded-full blur-2xl" />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-2 right-0 lg:top-4 lg:-right-4 bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-border"
            >
              <p className="text-xs text-muted-foreground text-center">Works on</p>
              <p className="text-sm font-bold text-center">Oil, Gas &</p>
              <p className="text-sm font-bold text-primary text-center">
                Electrical Fires!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
