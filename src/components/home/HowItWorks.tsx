"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CookingPot } from "lucide-react";

const products = [
  {
    id: "firekiller",
    label: "FireKiller Extinguisher",
    icon: Flame,
    subtitle: "No training needed. Anyone can use it in an emergency.",
    steps: [
      {
        step: "01",
        title: "Pull the Pin",
        description:
          "Remove the safety pin to unlock the extinguisher handle",
        icon: (
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            <path d="M24 12v12l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
          </svg>
        ),
      },
      {
        step: "02",
        title: "Aim at Base",
        description:
          "Point the nozzle at the base of the fire, not the flames",
        icon: (
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
            <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" className="text-primary/50" />
          </svg>
        ),
      },
      {
        step: "03",
        title: "Squeeze & Sweep",
        description:
          "Press the handle and sweep side to side until fire is out",
        icon: (
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            <path d="M14 24h20M30 18l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "pansafe",
    label: "PanSafe Sachet",
    icon: CookingPot,
    subtitle: "Kitchen fire? Just toss the sachet. It does the rest.",
    steps: [
      {
        step: "01",
        title: "Detect the Fire",
        description:
          "Spot flames in your cooking pan — oil, gas or grease fire",
        icon: (
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            <path d="M24 14c0 0-8 8-8 16a8 8 0 0016 0c0-8-8-16-8-16z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
          </svg>
        ),
      },
      {
        step: "02",
        title: "Toss the Sachet",
        description:
          "Simply throw the PanSafe sachet into the burning pan from a safe distance",
        icon: (
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            <path d="M16 32l8-16 8 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
            <path d="M20 26h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/60" />
          </svg>
        ),
      },
      {
        step: "03",
        title: "Fire Extinguished",
        description:
          "The sachet bursts and releases fire-suppressing powder instantly",
        icon: (
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
          </svg>
        ),
      },
    ],
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("firekiller");
  const active = products.find((p) => p.id === activeTab)!;

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Simple as <span className="text-primary">1-2-3</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            No training needed. See how easy fire safety can be.
          </p>
        </motion.div>

        {/* Product Tabs */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === p.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <p.icon className="h-4 w-4" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* Subtitle */}
            <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
              {active.subtitle}
            </p>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connector Lines (Desktop) */}
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-border" />

              {active.steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* Icon Container */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border mb-6 shadow-sm">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
