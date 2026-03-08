"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Send, CheckCircle, XCircle, Clock } from "lucide-react";

interface CODOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  codVerified: boolean;
  codVerificationSentAt: string | null;
  createdAt: string;
  address: { name: string; phone: string; city: string };
  items: { product: { name: string }; quantity: number }[];
}

export default function CODOrdersPage() {
  const [orders, setOrders] = useState<CODOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/cod-orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      console.error("Failed to fetch COD orders");
    } finally {
      setLoading(false);
    }
  }

  async function sendVerification(orderId: string) {
    setSendingId(orderId);
    try {
      const res = await fetch("/api/orders/cod-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchOrders();
      } else {
        alert(data.error || "Failed to send verification");
      }
    } catch {
      alert("Failed to send verification");
    } finally {
      setSendingId(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary">COD Orders</h1>
            <p className="text-sm text-muted-foreground">
              Verify Cash on Delivery orders via WhatsApp
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Items</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Verification</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-secondary">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-secondary">{order.address.name}</p>
                    <p className="text-xs text-muted-foreground">{order.address.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-secondary">
                    ₹{order.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    {order.codVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </span>
                    ) : order.status === "CANCELLED" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-700">
                        <XCircle className="h-3 w-3" /> Cancelled
                      </span>
                    ) : order.codVerificationSentAt ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700">
                        <Clock className="h-3 w-3" /> Awaiting Reply
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-50 text-gray-600">
                        Not Sent
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!order.codVerified && order.status !== "CANCELLED" && (
                      <button
                        onClick={() => sendVerification(order.id)}
                        disabled={sendingId === order.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="h-3 w-3" />
                        {sendingId === order.id
                          ? "Sending..."
                          : order.codVerificationSentAt
                          ? "Resend"
                          : "Send Verification"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No COD orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
