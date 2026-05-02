"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface TrackResult {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  awbCode?: string | null;
  trackingUrl?: string | null;
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:    { label: "Pending",    color: "text-yellow-600 bg-yellow-50 border-yellow-200",  icon: Clock },
  CONFIRMED:  { label: "Confirmed",  color: "text-blue-600 bg-blue-50 border-blue-200",        icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "text-purple-600 bg-purple-50 border-purple-200",  icon: RefreshCw },
  SHIPPED:    { label: "Shipped",    color: "text-indigo-600 bg-indigo-50 border-indigo-200",  icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "text-green-600 bg-green-50 border-green-200",     icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "text-red-600 bg-red-50 border-red-200",           icon: XCircle },
  REFUNDED:   { label: "Refunded",   color: "text-gray-600 bg-gray-50 border-gray-200",        icon: RefreshCw },
};

const TIMELINE = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [showItems, setShowItems] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `/api/orders/track?order=${encodeURIComponent(orderNumber.trim().toUpperCase())}&email=${encodeURIComponent(email.trim().toLowerCase())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found. Please check your order number and email.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG.PENDING) : null;
  const StatusIcon = cfg?.icon ?? Clock;

  const timelineStep = result ? TIMELINE.indexOf(result.status) : -1;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
            <Package className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-secondary">Track Your Order</h1>
          <p className="text-muted-foreground mt-2">
            Enter your order number and email to see the latest status
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleTrack}
          className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Order Number *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="FK-20260502-XXXX"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono uppercase"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Found in your order confirmation email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The email you used at checkout
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? "Looking up…" : "Track Order"}
          </button>
        </form>

        {/* Result */}
        <AnimatePresence>
          {result && cfg && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="space-y-4"
            >
              {/* Status Card */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Order</p>
                    <p className="text-lg font-bold text-secondary font-mono">
                      {result.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Placed on{" "}
                      {new Date(result.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${cfg.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    {cfg.label}
                  </span>
                </div>

                {/* Timeline (only for non-cancelled) */}
                {result.status !== "CANCELLED" && result.status !== "REFUNDED" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between relative">
                      {/* Progress bar */}
                      <div className="absolute left-4 right-4 top-4 h-0.5 bg-border">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width:
                              timelineStep <= 0 ? "0%" :
                              timelineStep === 1 ? "33%" :
                              timelineStep === 2 ? "66%" :
                              "100%",
                          }}
                        />
                      </div>

                      {TIMELINE.map((status, idx) => {
                        const done = timelineStep >= idx;
                        const stepCfg = STATUS_CONFIG[status];
                        const StepIcon = stepCfg.icon;
                        return (
                          <div key={status} className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${done ? "bg-primary border-primary" : "bg-card border-border"}`}>
                              <StepIcon className={`h-3.5 w-3.5 ${done ? "text-white" : "text-muted-foreground"}`} />
                            </div>
                            <span className={`text-xs font-medium ${done ? "text-secondary" : "text-muted-foreground"}`}>
                              {stepCfg.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tracking link */}
                {result.awbCode && (
                  <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-700">AWB / Tracking Number</p>
                      <p className="text-sm font-mono font-bold text-blue-900">{result.awbCode}</p>
                    </div>
                    {result.trackingUrl && (
                      <a
                        href={result.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Track Shipment
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-secondary">Delivery Address</h3>
                </div>
                <p className="text-sm text-secondary font-medium">{result.address.name}</p>
                <p className="text-sm text-muted-foreground">
                  {result.address.line1}
                  {result.address.line2 ? `, ${result.address.line2}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.address.city}, {result.address.state} – {result.address.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{result.address.phone}</p>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <button
                  onClick={() => setShowItems((v) => !v)}
                  className="w-full flex items-center justify-between text-sm font-bold text-secondary mb-1"
                >
                  <span>Order Summary</span>
                  {showItems ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <AnimatePresence>
                  {showItems && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mt-3 mb-4">
                        {result.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium text-secondary">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5 pt-3 border-t border-border text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{result.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{Math.round(result.subtotal * 0.18).toLocaleString("en-IN")}</span>
                  </div>
                  {result.shipping > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>₹{result.shipping.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {result.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>−₹{result.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-secondary pt-1 border-t border-border">
                    <span>Total Paid</span>
                    <span>₹{result.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Need help */}
              <p className="text-center text-sm text-muted-foreground">
                Need help with this order?{" "}
                <a href="/contact" className="text-primary font-semibold hover:underline">
                  Contact Us
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
