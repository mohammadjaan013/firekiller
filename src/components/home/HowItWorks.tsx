"use client";

import { motion } from "framer-motion";
import { Target, Timer, ThumbsUp, Recycle } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Aim at Base",
    description: "Point the nozzle at the base of the fire, not at the flames",
    step: "01",
  },
  {
    icon: Timer,
    title: "Squeeze Handle",
    description: "Press the handle firmly to release the extinguishing agent",
    step: "02",
  },
  {
    icon: ThumbsUp,
    title: "Sweep Side to Side",
    description: "Move the extinguisher in a sweeping motion across the fire",
    step: "03",
  },
  {
    icon: Recycle,
    title: "No Refill Needed",
    description: "Single-use design means zero maintenance and always ready",
    step: "04",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
            How <span className="text-primary">It Works</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Using FireKiller is as simple as 1-2-3. No training needed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
              )}

              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg border border-border mb-5">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-secondary">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
