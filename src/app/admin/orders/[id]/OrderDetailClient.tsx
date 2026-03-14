"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Package,
  Truck,
  Mail,
  MapPin,
  CreditCard,
  User,
  MessageCircle,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface OrderProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    paymentMethod: string | null;
    paymentId: string | null;
    paymentStatus: string | null;
    notes: string | null;
    awbCode: string | null;
    trackingUrl: string | null;
    emailSentToAdmin: boolean;
    customerEmail: string | null;
    createdAt: string;
    user: { name: string | null; email: string; phone: string | null } | null;
    address: {
      name: string;
      phone: string;
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      pincode: string;
    } | null;
    items: {
      id: string;
      quantity: number;
      price: number;
      total: number;
      product: {
        name: string;
        images: { url: string }[];
      };
    }[];
    whatsappLogs: {
      id: string;
      templateName: string;
      status: string;
      sentAt: string;
    }[];
  };
}

const STATUS_OPTIONS = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"];

export default function OrderDetailClient({ order: initialOrder }: OrderProps) {
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || "pending");
  const [notes, setNotes] = useState(order.notes || "");
  const [awbCode, setAwbCode] = useState(order.awbCode || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [saving, setSaving] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [message, setMessage] = useState("");

  const GST_RATE = 0.18;
  const baseSubtotal = Math.round(order.subtotal / (1 + GST_RATE));
  const gstAmount = order.subtotal - baseSubtotal;

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus, notes, awbCode, trackingUrl }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setOrder((prev) => ({ ...prev, ...data.order }));
      setMessage("Order updated successfully!");
    } catch {
      setMessage("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async () => {
    setEmailing(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_email" }),
      });
      if (!res.ok) throw new Error("Failed");
      setOrder((prev) => ({ ...prev, emailSentToAdmin: true }));
      setMessage("Email sent successfully!");
    } catch {
      setMessage("Failed to send email");
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column: Order Items + Customer */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Items */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden border border-border shrink-0">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-secondary">
                  ₹{item.total.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          {/* Financial Summary */}
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal (excl. GST)</span><span>₹{baseSubtotal.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{gstAmount.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount.toLocaleString("en-IN")}</span></div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
              <span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Name</p>
              <p className="font-medium text-secondary">{order.address?.name || order.user?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Phone</p>
              <p className="font-medium text-secondary">{order.address?.phone || order.user?.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Email</p>
              <p className="font-medium text-secondary">{order.customerEmail || order.user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment</p>
              <p className="font-medium text-secondary">
                {order.paymentMethod?.toUpperCase()} — {order.paymentId || "N/A"}
              </p>
            </div>
          </div>

          {order.address && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-muted-foreground mb-1 text-sm flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Delivery Address
              </p>
              <p className="text-sm text-secondary">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}<br />
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp Logs */}
        {order.whatsappLogs.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              WhatsApp Messages
            </h2>
            <div className="space-y-2">
              {order.whatsappLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                  <span className="text-secondary">{log.templateName}</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      log.status === "DELIVERED" ? "bg-green-50 text-green-700" :
                      log.status === "SENT" ? "bg-blue-50 text-blue-700" :
                      "bg-red-50 text-red-700"
                    }`}>{log.status}</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Actions */}
      <div className="space-y-6">
        {/* Status Management */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Manage Order
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {PAYMENT_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Internal notes..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Shipment
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                AWB / Tracking Number
              </label>
              <input
                type="text"
                value={awbCode}
                onChange={(e) => setAwbCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter AWB code"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Tracking URL
              </label>
              <input
                type="url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Email Notification */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-600" />
            Email Notification
          </h2>

          <p className="text-sm text-muted-foreground mb-3">
            {order.emailSentToAdmin
              ? "✅ Email has been sent to sales@oustfire.com"
              : "Send order details via email."}
          </p>

          <button
            onClick={handleSendEmail}
            disabled={emailing}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {emailing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {order.emailSentToAdmin ? "Resend Email" : "Send Email"}
          </button>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Payment: {order.paymentStatus === "paid" ? "✅ Paid" : "⏳ " + (order.paymentStatus || "pending")}
            </span>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium text-center ${
            message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
