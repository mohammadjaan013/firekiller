import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default async function AdminCouponsPage() {
  await requireAdmin();

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-muted-foreground hover:text-secondary lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary">Coupons</h1>
            <p className="text-sm text-muted-foreground">{coupons.length} coupons</p>
          </div>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/70 text-white text-sm font-semibold cursor-not-allowed"
        >
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Value</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Min Order</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Usage</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Expires</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-secondary">{coupon.code}</p>
                    {coupon.description && (
                      <p className="text-xs text-muted-foreground">{coupon.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{coupon.discountType}</td>
                  <td className="px-4 py-3 text-secondary font-medium">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue.toLocaleString("en-IN")}`}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.minOrder ? `₹${coupon.minOrder.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("en-IN")
                      : "No expiry"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        coupon.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No coupons found.
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
