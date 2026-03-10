"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  "Works on Oil, Gas & Electrical fires",
  "Zero maintenance for 5 years",
  "ISI Certified & BIS Approved",
  "Non-toxic, eco-friendly clean agent",
  "Compact — fits on a shelf or in your car",
];

export default function WhyFireKiller() {
  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Why Choose Us
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary mb-6">
              Why FireKiller?
            </h2>

            <ul className="space-y-3">
              {reasons.map((reason, i) => (
                <motion.li
                  key={reason}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 mt-0.5 shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-sm text-secondary">{reason}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center px-7 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-md"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-2 gap-5"
          >
            {[
              { value: "12,400+", label: "Homes Protected" },
              { value: "5 Year", label: "Zero Maintenance" },
              { value: "4.8★", label: "Customer Rating" },
              { value: "24/7", label: "WhatsApp Support" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#fafafa] rounded-2xl border border-border p-6 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
