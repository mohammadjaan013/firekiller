import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, FileText, Eye, EyeOff } from "lucide-react";
import DeleteBlogButton from "./DeleteBlogButton";

export default async function AdminBlogsPage() {
  await requireAdmin();

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {posts.length} posts total
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary mb-2">
            No blog posts yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first blog post to get started
          </p>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary hidden lg:table-cell">
                  Date
                </th>
                <th className="text-right px-4 py-3 font-semibold text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-secondary line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      /{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                        post.category === "PanSafe"
                          ? "bg-orange-500/10 text-orange-600"
                          : post.category === "FireKiller"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {post.category || "General"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {post.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <Eye className="h-3 w-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                        <EyeOff className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${post.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteBlogButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
