import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const categoryColors: Record<string, string> = {
  "Fire Safety": "bg-blue-500/10 text-blue-600",
  "Product Guide": "bg-green-500/10 text-green-600",
  "Product Review": "bg-amber-500/10 text-amber-600",
};

export default function BlogPage() {
  const featured = blogPosts[blogPosts.length - 1];
  const otherPosts = [...blogPosts].slice(0, -1).reverse();

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
            Fire Safety <span className="text-primary">Blog</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Latest fire news, safety tips, and insights to keep you and your
            family protected
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Post */}
        <Link href={`/blog/${featured.slug}`} className="block mb-8">
          <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid lg:grid-cols-2">
              <div className="h-48 lg:h-64 relative">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 text-[11px] font-semibold rounded-full w-fit">
                  <Tag className="h-3 w-3" />
                  Featured
                </span>
                <h2 className="mt-3 text-lg font-bold text-secondary line-clamp-2">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {featured.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
                <div className="h-32 relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full w-fit ${
                      categoryColors[post.category] || "bg-gray-100 text-gray-700"
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
                      {post.date}
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
      </div>
    </div>
  );
}
