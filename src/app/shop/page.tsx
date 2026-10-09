"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const mainProducts = [
  {
    title: "FireKiller Extinguisher",
    description:
      "Compact fire extinguisher for home, car & office. Works on Oil, Gas & Electrical fires. Zero maintenance for 5 years.",
    price: 1200,
    badge: "Best Seller",
    image: "/images/products/f30.png",
    href: "/shop/firekiller-1",
    packs: "Available in 1, 2 & 3 Unit packs",
  },
  {
    title: "PanSafe Sachet",
    description:
      "Kitchen fire sachet - just toss into a burning pan. Activates on contact. No pins, no aiming, no panic.",
    price: 666,
    badge: "Kitchen Essential",
    image: "/images/products/p10.png",
    href: "/shop/pansafe-1",
    packs: "Available in 1, 3 & 5 Pc packs",
  },
  {
    title: "Combo: FireKiller + PanSafe",
    description:
      "Get both - 1 FireKiller extinguisher + 1 PanSafe sachet. Complete protection for your home and kitchen.",
    price: 1500,
    badge: "Combo Offer",
    image: "/images/products/f30.png",
    image2: "/images/products/p10.png",
    href: "/shop/combo-firekiller-pansafe",
    packs: "Save ₹366 vs buying separately",
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-16">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">
            Shop <span className="text-primary">Fire Safety</span>
          </h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Complete protection for your home and kitchen.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainProducts.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={product.image2 ? "md:col-span-2 lg:col-span-1" : undefined}
            >
              <Link
                href={product.href}
                className="group block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {/* Image */}
                <div className="relative h-56 bg-white overflow-hidden">
                  {product.image2 ? (
                    <div className="absolute inset-0 grid grid-cols-2">
                      {[product.image, product.image2].map((src) => (
                        <div key={src} className="relative">
                          <Image
                            src={src}
                            alt={product.title}
                            fill
                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    {product.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 border-t border-border">
                  <h2 className="text-xl font-heading font-bold text-secondary">
                    {product.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-2xl font-bold text-secondary">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {/* <span className="text-sm text-muted-foreground ml-1">+GST</span> */}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.packs}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full group-hover:bg-primary-dark transition-colors">
                      View Options
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
