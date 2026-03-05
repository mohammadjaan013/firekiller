"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Eye, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const tabs = [
  { key: "all", label: "All" },
  { key: "home", label: "Home" },
  { key: "kitchen", label: "Kitchen" },
  { key: "car", label: "Car" },
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("all");
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();

  const filtered =
    activeTab === "all"
      ? products
      : products.filter((p) => p.categories.includes(activeTab));

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
    });
    showToast(`${product.name} added to cart!`);
  };

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
        >
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Our <span className="text-primary">Products</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Choose the right fire safety for every space
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((product, i) => {
              const alreadyInCart = isInCart(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-56 bg-muted overflow-hidden">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="block h-full"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const fallback = target.parentElement?.querySelector(".fallback");
                          if (fallback) (fallback as HTMLElement).style.display = "flex";
                        }}
                      />
                      <div className="fallback hidden absolute inset-0 items-center justify-center">
                        <div className="w-16 h-28 bg-linear-to-b from-red-500 to-red-600 rounded-lg shadow-md" />
                      </div>
                    </Link>

                    {/* Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-full z-10 pointer-events-none">
                      {product.badge}
                    </span>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="p-2 bg-card rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                        className="p-2 bg-card rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {product.categoryLabel}
                    </p>
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="mt-1 text-sm font-semibold line-clamp-2 min-h-10 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-lg font-bold">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-green-500">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`mt-4 w-full py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        alreadyInCart
                          ? "bg-green-600 text-white"
                          : "bg-primary text-white hover:bg-accent hover:scale-[1.01]"
                      }`}
                    >
                      {alreadyInCart ? (
                        <>
                          <Check className="h-4 w-4" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
