import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/blogs/[id]
 * Fetch a single blog post
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/blogs/[id]
 * Update a blog post
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, readTime, isPublished } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    // Check slug uniqueness (exclude current post)
    const existing = await prisma.blogPost.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 409 });
    }

    const current = await prisma.blogPost.findUnique({ where: { id } });

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        coverImage: coverImage || "",
        category: category || "General",
        readTime: readTime || "5 min read",
        isPublished: isPublished ?? false,
        publishedAt: isPublished && !current?.publishedAt ? new Date() : current?.publishedAt,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("PUT /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/blogs/[id]
 * Delete a blog post
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
