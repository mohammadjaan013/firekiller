import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Fire Safety Blog | FireKiller",
  description:
    "Expert articles on fire safety, kitchen fire prevention, product guides and tips to protect your home, kitchen and car.",
  openGraph: {
    title: "Fire Safety Blog | FireKiller",
    description:
      "Expert articles on fire safety, kitchen fire prevention, product guides and tips to protect your home, kitchen and car.",
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      readTime: true,
      publishedAt: true,
    },
  });

  return <BlogPageClient posts={posts} />;
}

