"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Home Safety",
    description: "FireKiller Extinguisher - compact, powerful, zero maintenance.",
    href: "/shop/firekiller-1",
    image: "/images/categories/f-c-h.png",
  },
  {
    title: "Kitchen Safety",
    description: "PanSafe Sachet - just toss into a burning pan. Done.",
    href: "/shop/pansafe-1",
    image: "/images/categories/kittu.png",
    highlighted: true,
  },
  {
    title: "Car Safety",
    description: "FireKiller for your car - fits under the seat, always ready.",
    href: "/shop/firekiller-1",
    image: "/images/categories/f-c-c.png",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-10 lg:py-14 bg-white">
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
              Categories
            </span>
            <span className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary">
            Choose Your Protection
          </h2>
        </motion.div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={cat.href}
                className={`group block rounded-2xl overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1 ${
                  cat.highlighted
                    ? "border-primary shadow-md"
                    : "border-border"
                }`}
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-4 py-3 bg-white">
                  <h3 className="text-sm font-heading font-bold text-secondary">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
