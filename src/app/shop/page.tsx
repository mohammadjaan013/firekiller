"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Eye,
  ChevronDown,
  X,
  Check,
  Plus,
  Minus,
  Zap,
  Trash2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const categories = [
  { value: "all", label: "All Products" },
  { value: "home", label: "Home Safety" },
  { value: "kitchen", label: "Kitchen Safety" },
  { value: "car", label: "Car Safety" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted" />}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const { addItem, isInCart, items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { showToast } = useToast();

  // Sync when URL changes (e.g. from CategoriesSection links)
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setSelectedCategory(cat);
  }, [searchParams]);

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

  const handleBuyNow = (product: (typeof products)[0]) => {
    if (!isInCart(product.id)) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
      });
    }
    router.push("/cart");
  };

  const getCartQuantity = (productId: number) => {
    const item = items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const filtered = products
    .filter(
      (p) => selectedCategory === "all" || p.categories.includes(selectedCategory)
    )
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (selectedSort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.reviews - a.reviews;
      }
    });

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Page Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-heading font-bold">
            Shop <span className="text-primary">Fire Safety</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse our range of compact fire extinguishers and safety products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-card rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-card rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-border text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } sm:block w-full sm:w-56 shrink-0`}
          >
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">
                  Categories
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? "bg-primary text-white"
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Price Range */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {["Under ₹1,000", "₹1,000 - ₹2,000", "₹2,000 - ₹3,000", "Above ₹3,000"].map(
                    (range) => (
                      <label
                        key={range}
                        className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        {range}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filtered.length} products
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product, i) => {
                const alreadyInCart = isInCart(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${product.slug}`}
                      className="relative block h-52 bg-muted overflow-hidden"
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
                      <div className="fallback hidden absolute inset-0 items-center justify-center">
                        <div className="w-14 h-24 bg-linear-to-b from-red-500 to-red-600 rounded-lg shadow-md" />
                      </div>
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-full z-10">
                        {product.badge}
                      </span>
                    </Link>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="p-2 bg-card rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-card rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="text-sm font-semibold text-secondary line-clamp-2 min-h-10 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>

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

                      {alreadyInCart ? (
                        <div className="mt-4 w-full py-2 text-sm font-semibold rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-between px-2">
                          <button
                            onClick={() => {
                              const qty = getCartQuantity(product.id);
                              if (qty <= 1) removeItem(product.id);
                              else updateQuantity(product.id, qty - 1);
                            }}
                            className="p-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-bold text-sm">{getCartQuantity(product.id)} in cart</span>
                          <button
                            onClick={() => updateQuantity(product.id, getCartQuantity(product.id) + 1)}
                            className="p-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-4 w-full py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" /> Add to Cart
                        </button>
                      )}

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="mt-2 w-full py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Zap className="h-4 w-4" /> Buy Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amazon-style Mini Cart Sidebar - fixed right side */}
      {items.length > 0 && (
        <div className="fixed top-20 right-4 z-30 hidden lg:block">
          <div className={`bg-card border border-border rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${
            miniCartOpen ? "w-72" : "w-auto"
          }`}>
            {/* Toggle Header */}
            <button
              onClick={() => setMiniCartOpen(!miniCartOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-secondary">
                  {miniCartOpen ? "Cart" : ""} ({totalItems})
                </span>
              </div>
              {miniCartOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground rotate-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
              )}
            </button>

            {/* Collapsible content */}
            <AnimatePresence>
              {miniCartOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border max-h-80 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 px-4 py-3 border-b border-border/50 last:border-0">
                        <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-secondary truncate">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-primary">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) removeItem(item.id);
                                else updateQuantity(item.id, item.quantity - 1);
                              }}
                              className="p-0.5 rounded border border-border hover:bg-muted transition-colors"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-0.5 rounded border border-border hover:bg-muted transition-colors"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border px-4 py-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-bold text-primary">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <Link
                      href="/cart"
                      className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all"
                    >
                      Go to Cart <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
