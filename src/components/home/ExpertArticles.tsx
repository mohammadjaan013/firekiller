import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const categoryColors: Record<string, string> = {
  PanSafe: "bg-orange-100 text-orange-700",
  FireKiller: "bg-red-100 text-red-700",
  General: "bg-blue-100 text-blue-700",
};

export default function ExpertArticles() {
  // Get the 3 latest blog posts
  const latest = [...blogPosts].reverse().slice(0, 3);

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                From Our Blog
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
              Read <span className="text-primary">Expert</span> Articles
            </h2>
            <p className="mt-2 text-muted-foreground">
              Stay informed with the latest fire safety tips and product guides
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-full text-sm font-medium text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Article Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold rounded-full ${
                    categoryColors[post.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-secondary text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors text-sm"
          >
            View All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
