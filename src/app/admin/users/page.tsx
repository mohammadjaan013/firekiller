import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="text-muted-foreground hover:text-secondary lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary">Users</h1>
          <p className="text-sm text-muted-foreground">{users.length} users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Orders</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-primary/10 text-primary font-semibold text-sm rounded-full flex items-center justify-center shrink-0">
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-secondary">{user.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700"
                          : user.role === "VENDOR"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user._count.orders}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No users yet.
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
