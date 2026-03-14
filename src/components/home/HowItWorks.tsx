"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const firekillerSteps = [
  {
    number: "01",
    title: "Remove the Seal",
    description: "Pull the safety pin to unlock the handle. Takes 1 second.",
    image: "/images/products/f-s-1.png",
  },
  {
    number: "02",
    title: "Aim at Base",
    description: "Point the nozzle at the base of the fire - not the flames.",
    image: "/images/products/f-s-2.png",
  },
  {
    number: "03",
    title: "Squeeze & Spray",
    description: "Press the handle and sweep side to side. Fire out in seconds.",
    image: "/images/products/f-s-3.png",
  },
];

const pansafeSteps = [
  {
    number: "01",
    title: "Detect the Fire",
    description: "Keep PanSafe near your stove - always within arm's reach.",
    image: "/images/products/p-s-1.png",
  },
  {
    number: "02",
    title: "Drop Into the Pan",
    description: "Simply drop the sachet into the burning pan. No aiming needed.",
    image: "/images/products/p-s-2.png",
  },
  {
    number: "03",
    title: "Fire Goes Out",
    description: "The sachet bursts on contact and suppresses the fire instantly.",
    image: "/images/products/p-s-3.png",
  },
];

const tabs = [
  { key: "firekiller", label: "FireKiller", steps: firekillerSteps },
  { key: "pansafe", label: "PanSafe", steps: pansafeSteps },
] as const;

export default function HowItWorks() {
  const [active, setActive] = useState<"firekiller" | "pansafe">("firekiller");
  const current = tabs.find((t) => t.key === active)!;

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

          {/* Product Toggle */}
          <div className="mt-6 inline-flex bg-white rounded-full border border-border p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key as "firekiller" | "pansafe")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {current.steps.map((step, i) => (
            <motion.div
              key={`${active}-${step.number}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="text-center"
            >
              <div className="relative inline-block mb-5">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={280}
                  height={220}
                  className="w-64 h-48 object-cover rounded-2xl shadow-md"
                />
                <span className="absolute -top-3 -right-3 w-9 h-9 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
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
