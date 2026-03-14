import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * GET /api/admin/products/[id]
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/products/[id] — update product
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name", "slug", "description", "shortDesc", "longDescription",
      "price", "originalPrice", "gstRate", "sku", "stock",
      "isActive", "isFeatured", "badge", "weight", "dimensions",
      "features", "specifications", "video", "packSize", "productLine",
      "categoryLabel", "categoryId",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (["price", "originalPrice", "gstRate", "weight"].includes(field)) {
          updateData[field] = body[field] !== null ? parseFloat(body[field]) : null;
        } else if (["stock", "packSize"].includes(field)) {
          updateData[field] = parseInt(body[field]) || 0;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < body.images.length; i++) {
        await prisma.productImage.create({
          data: {
            url: body.images[i].url,
            alt: body.images[i].alt || product.name,
            isPrimary: i === 0,
            sortOrder: i,
            productId: id,
          },
        });
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
