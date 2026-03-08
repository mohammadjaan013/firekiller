import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  FileText,
  MessageSquare,
  MessageCircle,
  ShieldCheck,
  Tag,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboard() {
  const user = await requireAdmin();

  // Fetch stats
  const [
    productCount,
    userCount,
    orderCount,
    categoryCount,
    blogCount,
    contactCount,
    couponCount,
    whatsappLogCount,
    codPendingCount,
    recentRevenue,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count(),
    prisma.coupon.count(),
    prisma.whatsappLog.count(),
    prisma.order.count({
      where: { paymentMethod: "cod", codVerified: false, status: { not: "CANCELLED" } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "paid" },
    }),
  ]);

  const stats = [
    { label: "Orders", value: orderCount, icon: ShoppingCart, color: "bg-purple-50 text-purple-600", href: "/admin/orders" },
    { label: "Revenue", value: `₹${(recentRevenue._sum.total || 0).toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-green-50 text-green-600", href: "/admin/orders" },
    { label: "COD Pending", value: codPendingCount, icon: ShieldCheck, color: "bg-amber-50 text-amber-600", href: "/admin/cod-orders" },
    { label: "WhatsApp Sent", value: whatsappLogCount, icon: MessageCircle, color: "bg-emerald-50 text-emerald-600", href: "/admin/whatsapp-logs" },
    { label: "Products", value: productCount, icon: Package, color: "bg-blue-50 text-blue-600", href: "/admin/products" },
    { label: "Users", value: userCount, icon: Users, color: "bg-indigo-50 text-indigo-600", href: "/admin/users" },
    { label: "Categories", value: categoryCount, icon: Tag, color: "bg-orange-50 text-orange-600", href: "/admin/categories" },
    { label: "Blog Posts", value: blogCount, icon: FileText, color: "bg-pink-50 text-pink-600", href: "/admin/blog" },
    { label: "Messages", value: contactCount, icon: MessageSquare, color: "bg-yellow-50 text-yellow-600", href: "/admin/messages" },
    { label: "Coupons", value: couponCount, icon: DollarSign, color: "bg-teal-50 text-teal-600", href: "/admin/coupons" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold">{user.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-secondary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-secondary">View Orders</span>
          </Link>
          <Link
            href="/admin/cod-orders"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-secondary">COD Verification</span>
          </Link>
          <Link
            href="/admin/whatsapp-logs"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-secondary">WhatsApp Logs</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Package className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-secondary">Manage Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
