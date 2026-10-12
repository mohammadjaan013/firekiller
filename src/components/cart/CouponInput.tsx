"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * Coupon code box - shared by the cart and checkout pages.
 * The discount shown is for display; checkout re-validates the coupon
 * server-side when the payment order is created.
 *
 * `amount` is the GST-inclusive subtotal the coupon is validated against.
 */
export default function CouponInput({ amount, className = "mb-6" }: { amount: number; className?: string }) {
  const { appliedCoupon, discount, applyCoupon, removeCoupon } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApply = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim(), subtotal: amount }),
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
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
            placeholder="Coupon code"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
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
    </div>
  );
}
