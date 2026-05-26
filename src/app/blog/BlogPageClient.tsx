"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

type DbPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  readTime: string | null;
  publishedAt: Date | null;
};

const CATEGORIES = ["All", "PanSafe", "FireKiller", "General"] as const;

const categoryColors: Record<string, string> = {
  PanSafe: "bg-orange-500/10 text-orange-600",
  FireKiller: "bg-red-500/10 text-red-600",
  General: "bg-blue-500/10 text-blue-600",
};

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPageClient({ posts }: { posts: DbPost[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
            Fire Safety <span className="text-primary">Blog</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Expert articles on fire safety, product guides, and tips to keep you
            and your family protected
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-card text-secondary border border-border hover:border-primary/50"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({posts.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
                <div className="h-32 relative">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full w-fit ${
                      categoryColors[post.category ?? ""] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {post.category}
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold text-secondary line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-auto pt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-2.5 w-2.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No articles found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
