import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { Package } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const user = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-muted py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-secondary mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-secondary">No orders yet</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Looks like you haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-secondary">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-green-50 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""} &middot;{" "}
                  <span className="font-semibold text-secondary">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
