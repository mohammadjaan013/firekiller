import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-muted-foreground hover:text-secondary lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary">Categories</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories</p>
          </div>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/70 text-white text-sm font-semibold cursor-not-allowed"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Sort</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Products</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-secondary">{category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{category.description || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{category.sortOrder}</td>
                  <td className="px-4 py-3 text-secondary font-medium">{category._count.products}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No categories found.
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
