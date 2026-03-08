"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, savings, totalItems, discount, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
        <div className="text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added any products yet
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-secondary">
            Shopping <span className="text-primary">Cart</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {totalItems} item{totalItems > 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl border border-border p-5 flex gap-4"
              >
                {/* Product Image */}
                <Link
                  href={`/shop/${item.slug}`}
                  className="relative w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(".fallback");
                      if (fallback) (fallback as HTMLElement).style.display = "flex";
                    }}
                  />
                  <div className="fallback hidden absolute inset-0 items-center justify-center">
                    <div className="w-8 h-14 bg-linear-to-b from-red-500 to-red-600 rounded" />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="text-sm font-semibold text-secondary truncate hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-secondary">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="text-lg font-bold text-secondary mb-4">
                Order Summary
              </h3>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!coupon.trim()) return;
                    setCouponLoading(true);
                    setCouponError("");
                    try {
                      const res = await fetch("/api/coupons/validate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code: coupon.trim(), subtotal }),
                      });
                      const data = await res.json();
                      if (!res.ok || !data.valid) {
                        throw new Error(data.error || "Invalid coupon");
                      }
                      applyCoupon(data.coupon.code, data.discount);
                    } catch (err) {
                      setCouponError(err instanceof Error ? err.message : "Invalid coupon");
                      removeCoupon();
                    } finally {
                      setCouponLoading(false);
                    }
                  }}
                  disabled={couponLoading}
                  className="px-4 py-2.5 bg-secondary text-white text-sm font-semibold rounded-xl hover:bg-primary transition-colors shrink-0 disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500 mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-xs text-green-600 mt-1">
                  Coupon &quot;{appliedCoupon}&quot; applied! You save ₹{discount.toLocaleString()}
                </p>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-secondary">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>You Save</span>
                  <span className="font-medium">
                    -₹{savings.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">
                      -₹{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-secondary">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-secondary">Total</span>
                  <span className="font-bold text-secondary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free shipping on orders above ₹999
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
