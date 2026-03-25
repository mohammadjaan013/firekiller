"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "../BlogEditor";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    readTime: string;
    isPublished: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const post = data.post || data;
        setInitialData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          coverImage: post.coverImage || "",
          category: post.category || "General",
          readTime: post.readTime || "5 min read",
          isPublished: post.isPublished ?? false,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  return <BlogEditor initialData={initialData} postId={id} />;
}
