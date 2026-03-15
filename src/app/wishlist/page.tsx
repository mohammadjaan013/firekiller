"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  images: { url: string }[];
}

interface WishlistEntry {
  id: string;
  productId: string;
  product: WishlistProduct;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch {
      // silent
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted pt-24 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-secondary mb-6">My Wishlist</h1>

        {loading ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-secondary">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Browse our products and add your favourites here.
            </p>
            <Link
              href="/shop"
              className="inline-flex px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const imgUrl =
                item.product.images?.[0]?.url || "/images/products/f30.png";
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-border p-4 flex items-center gap-4"
                >
                  <Link
                    href={`/shop/${item.product.slug}`}
                    className="relative w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0"
                  >
                    <Image
                      src={imgUrl}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="text-sm font-semibold text-secondary hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-bold text-secondary">
                        ₹{item.product.price.toLocaleString("en-IN")}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{item.product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removing === item.productId}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
