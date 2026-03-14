import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      address: { select: { name: true, phone: true, city: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="text-muted-foreground hover:text-secondary lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary">All Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} orders</p>
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
                <th className="text-left px-4 py-3 font-semibold text-secondary">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-primary transition-colors">
                      <p className="font-medium text-secondary hover:text-primary">{order.orderNumber}</p>
                      {order.awbCode && (
                        <p className="text-xs text-muted-foreground">AWB: {order.awbCode}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-secondary">{order.address?.name || order.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{order.address?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-muted-foreground">
                      {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-secondary">
                    ₹{order.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        order.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700"
                          : order.paymentStatus === "failed"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus || "pending"}
                    </span>
                    {order.paymentMethod && (
                      <p className="text-xs text-muted-foreground mt-0.5">{order.paymentMethod}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        order.status === "DELIVERED"
                          ? "bg-green-50 text-green-700"
                          : order.status === "CANCELLED"
                          ? "bg-red-50 text-red-700"
                          : order.status === "SHIPPED"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No orders yet.
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
