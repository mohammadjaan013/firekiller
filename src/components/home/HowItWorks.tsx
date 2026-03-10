"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Remove the Seal",
    description: "Pull the safety pin to unlock the handle. Takes 1 second.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <path d="M24 12v12l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Aim at Base",
    description: "Point the nozzle at the base of the fire — not the flames.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" className="text-primary/50" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Squeeze & Spray",
    description: "Press the handle and sweep side to side. Fire out in seconds.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <path d="M14 24h20M30 18l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 lg:py-14 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              How It Works
            </span>
            <span className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary">
            3 Simple Steps
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            No training needed. Anyone in the family can use it.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="text-center"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-border mb-5 shadow-sm">
                {step.icon}
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-heading font-bold text-secondary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
