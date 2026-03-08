"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "FK-XXXXXXXX-XXXX";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-10 w-10 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
          Order Placed!
        </h1>

        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been confirmed and
          will be shipped shortly.
        </p>

        {/* Order Number */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <p className="text-xs text-muted-foreground mb-1">Order Number</p>
          <p className="text-xl font-bold text-primary tracking-wider">
            {orderNumber}
          </p>

          {/* Timeline */}
          <div className="mt-6 space-y-4">
            {[
              {
                icon: CheckCircle,
                title: "Order Confirmed",
                desc: "Payment received successfully",
                active: true,
              },
              {
                icon: Package,
                title: "Processing",
                desc: "Your order is being prepared",
                active: false,
              },
              {
                icon: Truck,
                title: "Shipping",
                desc: "Tracking details will be shared via email",
                active: false,
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-start gap-3 text-left">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.active
                        ? "bg-green-500/10 text-green-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        step.active
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all"
          >
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-secondary font-semibold rounded-xl hover:bg-muted transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading…</div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
