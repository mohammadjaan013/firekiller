"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Flame, Car, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Home Safety",
    description: "FireKiller Extinguisher — 1, 2 or 3 Units",
    icon: Home,
    href: "/shop?category=home",
    image: "/images/categories/home.png",
  },
  {
    title: "Kitchen Safety",
    description: "PanSafe Sachet — 1, 3 or 5 Pcs",
    icon: Flame,
    href: "/shop?category=kitchen",
    image: "/images/categories/kitchen.png",
  },
  {
    title: "Car Safety",
    description: "FireKiller Car — 1, 2 or 3 Units",
    icon: Car,
    href: "/shop?category=car",
    image: "/images/categories/car.png",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            Choose <span className="text-primary">Your</span> Protection
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Select the right fire safety solution for every area of your life
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Link
                href={cat.href}
                className="group block overflow-hidden rounded-2xl bg-card border border-border transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 hover:border-primary/30"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 p-2.5 bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-xl shadow-lg">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-heading font-bold">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cat.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Shop Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
