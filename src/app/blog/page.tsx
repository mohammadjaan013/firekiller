import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Massive Fire Breaks Out in Mumbai High-Rise — Lessons for Every Homeowner",
    excerpt:
      "A devastating fire in a Mumbai residential building has once again highlighted the critical need for fire safety equipment in every Indian home.",
    category: "Fire News",
    date: "Mar 8, 2026",
    readTime: "4 min read",
    slug: "mumbai-highrise-fire-lessons",
  },
  {
    id: 2,
    title: "Kitchen Oil Fires: Why Water Makes It Worse",
    excerpt:
      "Most kitchen fires in India start with cooking oil. Learn why throwing water on an oil fire is the worst thing you can do and what to do instead.",
    category: "Fire Safety",
    date: "Mar 5, 2026",
    readTime: "4 min read",
    slug: "kitchen-oil-fires-water",
  },
  {
    id: 3,
    title: "India's Fire Safety Market Growing at 12% — What It Means for You",
    excerpt:
      "With over 17,000 fire deaths annually, India is finally waking up to fire safety. Here's what's driving the change and how to stay protected.",
    category: "Industry",
    date: "Mar 1, 2026",
    readTime: "6 min read",
    slug: "fire-safety-market-india-2026",
  },
  {
    id: 4,
    title: "5 Essential Fire Safety Tips Every Indian Household Needs",
    excerpt:
      "Fire emergencies can happen anywhere, anytime. Here are 5 critical fire safety measures that every household in India should implement today.",
    category: "Fire Safety",
    date: "Feb 25, 2026",
    readTime: "5 min read",
    slug: "fire-safety-tips-indian-home",
  },
  {
    id: 5,
    title: "Delhi Factory Fire Claims 7 Lives — Why Compact Extinguishers Matter",
    excerpt:
      "Yet another industrial fire tragedy in Delhi. Experts say compact extinguishers at every workstation could have prevented the casualties.",
    category: "Fire News",
    date: "Feb 20, 2026",
    readTime: "3 min read",
    slug: "delhi-factory-fire-compact-extinguishers",
  },
  {
    id: 6,
    title: "How to Choose the Right Fire Extinguisher for Your Car",
    excerpt:
      "Your car is a highly flammable environment. Learn what type of extinguisher you need and where to keep it for maximum safety.",
    category: "Fire Safety",
    date: "Feb 15, 2026",
    readTime: "4 min read",
    slug: "fire-extinguisher-car-guide",
  },
];

const categoryColors: Record<string, string> = {
  "Fire News": "bg-red-500/10 text-red-600",
  "Fire Safety": "bg-blue-500/10 text-blue-600",
  Industry: "bg-green-500/10 text-green-600",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary">
            Fire Safety <span className="text-primary">Blog</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Latest fire news, safety tips, and insights to keep you and your
            family protected
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-12 hover:shadow-lg transition-shadow">
          <div className="grid lg:grid-cols-2">
            <div className="h-64 lg:h-auto bg-muted flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-32 mx-auto bg-linear-to-b from-red-500 to-red-600 rounded-lg opacity-40" />
                <p className="mt-2 text-xs text-muted-foreground">Featured Image</p>
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full w-fit">
                <Tag className="h-3 w-3" />
                Featured
              </span>
              <h2 className="mt-4 text-2xl font-bold text-secondary">
                {blogPosts[0].title}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {blogPosts[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <Link
                href={`/blog/${blogPosts[0].slug}`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="h-44 bg-muted flex items-center justify-center">
                <div className="w-16 h-20 bg-linear-to-b from-red-400 to-red-500 rounded-lg opacity-30" />
              </div>
              <div className="p-5">
                <span
                  className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                    categoryColors[post.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {post.category}
                </span>
                <h3 className="mt-3 text-base font-bold text-secondary line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-4">
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
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Read More <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
