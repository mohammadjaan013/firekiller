"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  CookingPot,
  Play,
  ShoppingCart,
  ChevronRight,
  Shield,
  Clock,
  Zap,
} from "lucide-react";

/* ── product data ─────────────────────────────────────── */
const productLines = [
  {
    id: "firekiller",
    label: "FireKiller Extinguisher",
    icon: Flame,
    tagline: "No training needed. Anyone can use it in an emergency.",
    video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
    shopSlug: "firekiller-1",
    steps: [
      {
        num: "01",
        title: "Pull the Pin",
        desc: "Remove the safety pin to unlock the extinguisher handle.",
      },
      {
        num: "02",
        title: "Aim at Base",
        desc: "Point the nozzle at the base of the fire, not the flames.",
      },
      {
        num: "03",
        title: "Squeeze & Sweep",
        desc: "Press the handle and sweep side-to-side until the fire is out.",
      },
    ],
    highlights: [
      { icon: Shield, text: "5-year zero-maintenance warranty" },
      { icon: Clock, text: "8–10 second discharge time" },
      { icon: Zap, text: "ABC + Electrical fire rated" },
    ],
  },
  {
    id: "pansafe",
    label: "PanSafe Sachet",
    icon: CookingPot,
    tagline: "Kitchen fire? Just toss the sachet. It does the rest.",
    video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
    shopSlug: "pansafe-1",
    steps: [
      {
        num: "01",
        title: "Detect the Fire",
        desc: "Spot flames in your cooking pan - oil, gas, or grease fire.",
      },
      {
        num: "02",
        title: "Toss the Sachet",
        desc: "Throw PanSafe into the burning pan from a safe distance.",
      },
      {
        num: "03",
        title: "Fire Extinguished",
        desc: "The sachet bursts and instantly suppresses the fire.",
      },
    ],
    highlights: [
      // { icon: Shield, text: "Non-toxic, food-safe agent" },
      { icon: Clock, text: "3-year shelf life" },
      { icon: Zap, text: "No pins, no training, no panic" },
    ],
  },
];

/* ── page ─────────────────────────────────────────────── */
export default function HowItWorksPage() {
  const [activeId, setActiveId] = useState("firekiller");
  const active = productLines.find((p) => p.id === activeId)!;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            How It <span className="text-primary">Works</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch the demo videos and learn how simple fire safety can be -
            no training needed, anyone can do it.
          </p>
        </motion.div>

        {/* ── Product Tabs ────────────────────────────── */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border">
            {productLines.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeId === p.id
                      ? "bg-primary text-white shadow-md"
                      : "text-secondary hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active product section ──────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Tagline */}
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              {active.tagline}
            </p>

            {/* Video */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black shadow-xl">
                <iframe
                  src={active.video}
                  title={`${active.label} demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Play className="h-4 w-4 text-primary" />
                Watch the full demo above
              </div>
            </div>

            {/* Steps */}
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Simple as <span className="text-primary">1-2-3</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 mb-14">
              {active.steps.map((s, i) => (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="relative bg-card border border-border rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {s.num}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                  {i < active.steps.length - 1 && (
                    <ChevronRight className="hidden sm:block absolute -right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/40" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid sm:grid-cols-3 gap-4 mb-14">
              {active.highlights.map((h) => {
                const HIcon = h.icon;
                return (
                  <div
                    key={h.text}
                    className="flex items-center gap-3 bg-card border border-border rounded-xl p-4"
                  >
                    <HIcon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-secondary font-medium">
                      {h.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href={`/shop/${active.shopSlug}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <ShoppingCart className="h-5 w-5" />
                Shop {active.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
