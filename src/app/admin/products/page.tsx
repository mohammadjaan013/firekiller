import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Pencil } from "lucide-react";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { orderItems: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">SKU</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Price (excl. GST)</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Orders</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-muted rounded-lg overflow-hidden border border-border shrink-0">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-secondary truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-secondary">₹{product.price.toLocaleString("en-IN")}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock > 10 ? "text-green-700" : product.stock > 0 ? "text-amber-600" : "text-red-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product.category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product._count.orderItems}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {product.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No products yet.{" "}
                    <Link href="/admin/products/new" className="text-primary underline">Add your first product</Link>
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
