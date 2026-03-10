"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const mainProducts = [
  {
    title: "FireKiller Extinguisher",
    description:
      "Compact fire extinguisher for home, car & office. Works on Oil, Gas & Electrical fires. Zero maintenance for 5 years.",
    price: 943,
    rating: 4.8,
    reviews: 324,
    badge: "Best Seller",
    image: "/images/products/firekiller-1.webp",
    href: "/shop/firekiller-1",
    packs: "Available in 1, 2 & 3 Unit packs",
  },
  {
    title: "PanSafe Sachet",
    description:
      "Kitchen fire sachet — just toss into a burning pan. Activates on contact. No pins, no aiming, no panic.",
    price: 1299,
    rating: 4.7,
    reviews: 456,
    badge: "Kitchen Essential",
    image: "/images/products/pansafe-1.webp",
    href: "/shop/pansafe-1",
    packs: "Available in 1, 3 & 5 Pc packs",
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
            Two products. Complete protection for your home and kitchen.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {mainProducts.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={product.href}
                className="group block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {/* Image */}
                <div className="relative h-56 bg-white overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                  />
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

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`h-3.5 w-3.5 ${
                            j < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-2xl font-bold text-secondary">
                        ₹{product.price.toLocaleString()}
                      </span>
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
