"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const featured = products.slice(0, 4);

export default function FeaturedProducts() {
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: (typeof featured)[0]) => {
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most popular fire safety solutions
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View All Products →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => {
            const alreadyInCart = isInCart(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative block h-56 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(".fallback");
                      if (fallback) (fallback as HTMLElement).style.display = "flex";
                    }}
                  />
                  {/* Fallback */}
                  <div className="fallback hidden absolute inset-0 items-center justify-center">
                    <div className="w-16 h-28 bg-gradient-to-b from-red-500 to-red-600 rounded-lg shadow-md" />
                  </div>

                  {/* Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-full z-10">
                    {product.badge}
                  </span>
                </Link>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.categoryLabel}
                  </p>
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="mt-1 text-sm font-semibold text-secondary line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-secondary">
                      {product.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-lg font-bold text-secondary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % off
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`mt-4 w-full py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      alreadyInCart
                        ? "bg-green-600 text-white"
                        : "bg-secondary text-white hover:bg-primary"
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
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
