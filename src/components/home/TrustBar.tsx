"use client";

import { Truck, ShieldCheck, Banknote, Headphones, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Truck, label: "Free Shipping" },
  { icon: ShieldCheck, label: "1-Year Warranty" },
  { icon: Banknote, label: "COD Available" },
  { icon: Headphones, label: "24x7 Support" },
  { icon: Award, label: "ISI Certified" },
];

export default function TrustBar() {
  return (
    <section className="bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 overflow-x-auto gap-8 scrollbar-hide">
          {features.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-2.5 shrink-0"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">
                {label}
              </span>
              {i < features.length - 1 && (
                <div className="hidden md:block w-px h-6 bg-border ml-6" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
