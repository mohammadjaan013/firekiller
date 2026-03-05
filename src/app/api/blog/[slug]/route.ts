import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * GET /api/blog/[slug] — get a single blog post
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // If not published, only admin can see it
    if (!post.isPublished) {
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/blog/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/[slug] — update a blog post (admin only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await req.json();

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // If being published for the first time, set publishedAt
    const publishedAt =
      body.isPublished && !existing.isPublished
        ? new Date()
        : existing.publishedAt;

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        title: body.title ?? existing.title,
        slug: body.newSlug ?? existing.slug,
        excerpt: body.excerpt ?? existing.excerpt,
        content: body.content ?? existing.content,
        coverImage: body.coverImage ?? existing.coverImage,
        category: body.category ?? existing.category,
        readTime: body.readTime ?? existing.readTime,
        isPublished: body.isPublished ?? existing.isPublished,
        publishedAt,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("PUT /api/blog/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[slug] — delete a blog post (admin only)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({ where: { slug } });

    return NextResponse.json({ message: "Blog post deleted" });
  } catch (error) {
    console.error("DELETE /api/blog/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
