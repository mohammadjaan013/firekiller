import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * GET /api/admin/products - list all products (admin)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        _count: { select: { orderItems: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * POST /api/admin/products - create a product
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name, slug, description, shortDesc, longDescription,
      price, originalPrice, gstRate, sku, stock,
      isActive, isFeatured, badge, weight, dimensions,
      features, specifications, video, packSize, productLine,
      categoryLabel, categoryId, images,
    } = body;

    if (!name || !slug || !description || !price || !sku || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, description, price, sku, categoryId" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Product with this slug or SKU already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description,
        shortDesc: shortDesc || null,
        longDescription: longDescription || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        gstRate: gstRate ? parseFloat(gstRate) : 0.18,
        sku, stock: parseInt(stock) || 0,
        isActive: isActive !== false,
        isFeatured: !!isFeatured,
        badge: badge || null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        features: features || [],
        specifications: specifications || null,
        video: video || null,
        packSize: parseInt(packSize) || 1,
        productLine: productLine || null,
        categoryLabel: categoryLabel || null,
        categoryId,
      },
    });

    // Create images
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            url: images[i].url,
            alt: images[i].alt || product.name,
            isPrimary: i === 0,
            sortOrder: i,
            productId: product.id,
          },
        });
      }
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
