import type { Metadata } from "next";
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

export default function BlogPage() {
  return <BlogPageClient />;
}

