import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { blogPosts } from "@/data/blogPosts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} | FireKiller Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  // Get related posts (same category, excluding current)
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header section with full-width cover */}
      <div className="relative">
        {/* Cover image - full width */}
        <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-secondary/5">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Title overlay */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 sm:-mt-40 z-10">
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-border/50">
            {/* Back + Category */}
            <div className="flex items-center justify-between mb-5">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                All Articles
              </Link>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  post.category === "PanSafe"
                    ? "bg-orange-500/10 text-orange-600"
                    : post.category === "FireKiller"
                    ? "bg-red-500/10 text-red-600"
                    : "bg-blue-500/10 text-blue-600"
                }`}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-secondary leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
              <div className="flex items-center gap-3">
                {/* Author avatar */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  OF
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    OustFire
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-secondary">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content - Medium style */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <article className="prose-blog">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Tags / Bottom CTA */}
        <div className="mt-14 pt-8 border-t border-border">
          <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 text-center border border-primary/10">
            <h3 className="text-lg font-heading font-bold text-secondary mb-2">
              Protect Your Home Today
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Don&apos;t wait for an emergency. Get{" "}
              {post.category === "PanSafe" ? "PanSafe" : "FireKiller"} and be
              prepared.
            </p>
            <Link
              href={
                post.category === "PanSafe"
                  ? "/shop/pansafe-1"
                  : "/shop/firekiller-1"
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors text-sm"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-14">
            <h3 className="text-lg font-heading font-bold text-secondary mb-6">
              More in {post.category}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group block bg-muted rounded-xl border border-border overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative h-28 bg-muted">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-secondary leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {r.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {r.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
