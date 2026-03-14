"use client";

import { motion } from "framer-motion";
import { Building2, Briefcase, Package, Award } from "lucide-react";

const stats = [
  { icon: Building2, value: "4200", suffix: "+", label: "Happy Clients" },
  { icon: Briefcase, value: "230", suffix: "", label: "Projects Executed" },
  { icon: Package, value: "42400", suffix: "", label: "Products Sold" },
  { icon: Award, value: "21", suffix: "", label: "Years of Experience" },
];

export default function WhyFireKiller() {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-xl p-6 text-center shadow-md border border-border"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-secondary">
                {stat.value}
                {stat.suffix && <span className="text-primary">{stat.suffix}</span>}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
