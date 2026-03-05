"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Check,
  Play,
  Share2,
} from "lucide-react";
import { getProductBySlug, products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "reviews">(
    "features"
  );

  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();

  if (!product) {
    notFound();
  }

  const alreadyInCart = isInCart(product.id);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
      },
      quantity
    );
    showToast(`${product.name} added to cart!`);
  };

  // Related products (same category, excluding current)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-secondary font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback =
                    target.parentElement?.querySelector(".fallback");
                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                }}
              />
              <div className="fallback hidden absolute inset-0 items-center justify-center">
                <div className="w-32 h-52 bg-gradient-to-b from-red-500 to-red-600 rounded-xl shadow-lg" />
              </div>

              {/* Badge */}
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-full">
                {product.badge}
              </span>

              {/* Video play button */}
              {product.video && (
                <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-secondary hover:bg-white transition-colors shadow-md">
                  <Play className="h-4 w-4 fill-primary text-primary" />
                  Watch Demo
                </button>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-contain p-2"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback =
                          target.parentElement?.querySelector(".fallback");
                        if (fallback)
                          (fallback as HTMLElement).style.display = "flex";
                      }}
                    />
                    <div className="fallback hidden absolute inset-0 items-center justify-center bg-gray-100">
                      <div className="w-6 h-10 bg-gradient-to-b from-red-500 to-red-600 rounded" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wide">
              {product.categoryLabel}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-secondary">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-secondary">
                {product.rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-secondary">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xl text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {discount}% OFF
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Inclusive of all taxes. Free shipping on orders above ₹999.
            </p>

            {/* Description */}
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-14 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${
                  alreadyInCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {alreadyInCart ? (
                  <>
                    <Check className="h-5 w-5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </>
                )}
              </button>

              {/* Share */}
              <button className="p-3.5 border border-border rounded-xl hover:bg-muted transition-colors">
                <Share2 className="h-5 w-5 text-secondary" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <span>5 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <RotateCcw className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mt-6">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  In Stock — Ships within 24 hours
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-border pt-10">
          <div className="flex gap-6 border-b border-border">
            {(
              [
                { key: "features", label: "Features" },
                { key: "specs", label: "Specifications" },
                { key: "reviews", label: `Reviews (${product.reviews})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "features" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid sm:grid-cols-2 gap-3"
              >
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-secondary">{feature}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg"
              >
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value], i) => (
                        <tr
                          key={key}
                          className={i % 2 === 0 ? "bg-muted" : "bg-white"}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-secondary">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {value}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-secondary">
                      {product.rating}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.reviews} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const percentage =
                        star === 5
                          ? 72
                          : star === 4
                          ? 19
                          : star === 3
                          ? 6
                          : star === 2
                          ? 2
                          : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-3">
                            {star}
                          </span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sample reviews */}
                <div className="space-y-4 mt-6">
                  {[
                    {
                      name: "Rahul M.",
                      date: "2 weeks ago",
                      rating: 5,
                      comment:
                        "Excellent quality! Compact and easy to use. Kept one in every room. Feels very reassuring knowing my family is protected.",
                    },
                    {
                      name: "Priya S.",
                      date: "1 month ago",
                      rating: 5,
                      comment:
                        "Best fire extinguisher I've ever bought. The quality is amazing and the design looks great. My neighbors ordered after seeing mine!",
                    },
                    {
                      name: "Amit K.",
                      date: "2 months ago",
                      rating: 4,
                      comment:
                        "Good product, works as advertised. Would have liked a slightly bigger nozzle, but overall very satisfied with the purchase.",
                    },
                  ].map((review, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 text-primary font-semibold text-sm rounded-full flex items-center justify-center">
                            {review.name[0]}
                          </div>
                          <span className="text-sm font-semibold text-secondary">
                            {review.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3.5 w-3.5 ${
                              j < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-border pt-10">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              You May Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/shop/${rp.slug}`}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative h-44 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                      src={rp.images[0]}
                      alt={rp.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback =
                          target.parentElement?.querySelector(".fallback");
                        if (fallback)
                          (fallback as HTMLElement).style.display = "flex";
                      }}
                    />
                    <div className="fallback hidden absolute inset-0 items-center justify-center">
                      <div className="w-12 h-20 bg-gradient-to-b from-red-500 to-red-600 rounded-lg shadow-md" />
                    </div>
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-[10px] font-semibold rounded-full z-10">
                      {rp.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-secondary line-clamp-1 group-hover:text-primary transition-colors">
                      {rp.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-bold text-secondary">
                        ₹{rp.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{rp.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
