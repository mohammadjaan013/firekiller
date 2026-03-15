import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * GET /api/products - list products with optional filters
 * Query params: category, search, sort, featured, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = { isActive: true };

    if (category && category !== "all") {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Compute average rating for each product
    const productsWithRating = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      return {
        ...p,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: p.reviews.length,
        reviews: undefined, // don't expose raw reviews array
      };
    });

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products - create a product (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDesc,
      price,
      originalPrice,
      sku,
      stock,
      categoryId,
      isFeatured,
      badge,
      weight,
      dimensions,
      images,
    } = body;

    // Validation
    if (!name || !slug || !description || !price || !sku || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, description, price, sku, categoryId" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc: shortDesc || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        sku,
        stock: parseInt(stock) || 0,
        categoryId,
        isFeatured: !!isFeatured,
        badge: badge || null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        images: images?.length
          ? {
              create: images.map(
                (img: { url: string; alt?: string; isPrimary?: boolean }, i: number) => ({
                  url: img.url,
                  alt: img.alt || name,
                  isPrimary: img.isPrimary || i === 0,
                  sortOrder: i,
                })
              ),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
