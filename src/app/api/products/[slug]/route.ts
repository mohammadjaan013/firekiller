import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/products/[slug] — single product with full details
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Compute rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    // Get related products (same category, exclude this one)
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { select: { rating: true } },
      },
      take: 4,
    });

    const relatedWithRating = related.map((p) => {
      const r =
        p.reviews.length > 0
          ? p.reviews.reduce((s, rv) => s + rv.rating, 0) / p.reviews.length
          : 0;
      return {
        ...p,
        rating: Math.round(r * 10) / 10,
        reviewCount: p.reviews.length,
        reviews: undefined,
      };
    });

    return NextResponse.json({
      product: {
        ...product,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      },
      related: relatedWithRating,
    });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
