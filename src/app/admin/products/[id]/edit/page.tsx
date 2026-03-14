"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  longDescription: string | null;
  price: number;
  originalPrice: number | null;
  gstRate: number;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  badge: string | null;
  weight: number | null;
  packSize: number;
  productLine: string | null;
  categoryLabel: string | null;
  categoryId: string;
  features: string[];
  video: string | null;
  images: { url: string; isPrimary: boolean }[];
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    longDescription: "",
    price: "",
    originalPrice: "",
    gstRate: "0.18",
    sku: "",
    stock: "0",
    isActive: true,
    isFeatured: false,
    badge: "",
    weight: "",
    packSize: "1",
    productLine: "",
    categoryLabel: "",
    categoryId: "",
    features: "",
    video: "",
    imageUrls: "",
  });

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
      Promise.all([
        fetch(`/api/admin/products/${id}`).then(r => r.json()),
        fetch("/api/admin/categories").then(r => r.ok ? r.json() : { categories: [] }),
      ]).then(([productData, catData]) => {
        const p: ProductData = productData.product || productData;
        setCategories(catData.categories || catData || []);
        setForm({
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDesc: p.shortDesc || "",
          longDescription: p.longDescription || "",
          price: String(p.price),
          originalPrice: p.originalPrice ? String(p.originalPrice) : "",
          gstRate: String(p.gstRate),
          sku: p.sku,
          stock: String(p.stock),
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          badge: p.badge || "",
          weight: p.weight ? String(p.weight) : "",
          packSize: String(p.packSize),
          productLine: p.productLine || "",
          categoryLabel: p.categoryLabel || "",
          categoryId: p.categoryId,
          features: (p.features || []).join("\n"),
          video: p.video || "",
          imageUrls: (p.images || []).map(img => img.url).join("\n"),
        });
        setLoading(false);
      }).catch(() => {
        setError("Failed to load product");
        setLoading(false);
      });
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        shortDesc: form.shortDesc || undefined,
        longDescription: form.longDescription || undefined,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        gstRate: parseFloat(form.gstRate),
        sku: form.sku,
        stock: parseInt(form.stock),
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        badge: form.badge || undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        packSize: parseInt(form.packSize),
        productLine: form.productLine || undefined,
        categoryLabel: form.categoryLabel || undefined,
        categoryId: form.categoryId,
        features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
        video: form.video || undefined,
        images: form.imageUrls.split("\n").map(u => u.trim()).filter(Boolean).map((url, i) => ({ url, isPrimary: i === 0 })),
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/products");
    } catch {
      setError("Failed to delete product");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-muted-foreground hover:text-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-secondary">Edit Product</h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</p>}

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-secondary">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Short Description</label>
            <input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description *</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Long Description</label>
            <textarea rows={4} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-secondary">Pricing & Inventory</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Base Price (excl. GST) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Original Price (MRP)</label>
              <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">GST Rate</label>
              <select value={form.gstRate} onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="0.05">5%</option>
                <option value="0.12">12%</option>
                <option value="0.18">18%</option>
                <option value="0.28">28%</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">SKU *</label>
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Weight (g)</label>
              <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-secondary">Classification</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category Label</label>
              <input value={form.categoryLabel} onChange={(e) => setForm({ ...form, categoryLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Product Line</label>
              <input value={form.productLine} onChange={(e) => setForm({ ...form, productLine: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Pack Size</label>
              <input type="number" value={form.packSize} onChange={(e) => setForm({ ...form, packSize: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Badge</label>
              <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-border" />
              Featured
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-secondary">Features & Media</h2>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Features (one per line)</label>
            <textarea rows={5} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Video URL</label>
            <input type="url" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Image URLs (one per line, first = primary)</label>
            <textarea rows={3} value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
