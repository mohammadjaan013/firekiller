"use client";

import Link from "next/link";
import { Home, Flame, Car, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Home Safety",
    description: "For Living & Bedrooms",
    icon: Home,
    href: "/shop?category=home",
    gradient: "from-orange-50 to-red-50",
    borderColor: "border-orange-200",
  },
  {
    title: "Kitchen Oil Fires",
    description: "PanSafe Sachet + FireKiller",
    icon: Flame,
    href: "/shop?category=kitchen",
    gradient: "from-red-50 to-pink-50",
    borderColor: "border-red-200",
  },
  {
    title: "Car Protection",
    description: "Compact & Ready",
    icon: Car,
    href: "/shop?category=car",
    gradient: "from-gray-50 to-slate-100",
    borderColor: "border-gray-200",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
            Choose <span className="text-primary">Your</span> Protection
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Select the right fire safety solution for every area of your life
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
            >
              <Link
                href={cat.href}
                className={`group block relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.borderColor} p-6 h-56 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <cat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold text-secondary">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cat.description}
                </p>

                {/* CTA */}
                <div className="absolute bottom-6 left-6 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Shop Now
                  <ChevronRight className="h-4 w-4" />
                </div>

                {/* Decorative Product placeholder */}
                <div className="absolute right-4 bottom-4 w-24 h-32 bg-white/60 rounded-xl flex items-center justify-center">
                  <div className="w-10 h-20 bg-gradient-to-b from-red-500 to-red-600 rounded-md opacity-60" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
