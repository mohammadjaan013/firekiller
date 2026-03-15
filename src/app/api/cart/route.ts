import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * GET /api/cart - get current user's cart
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });

    const cartItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        stock: item.product.stock,
        image: item.product.images[0]?.url || null,
      },
    }));

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart - add item to cart (or increment quantity)
 * Body: { productId: string, quantity?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // Verify product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Upsert: if already in cart, increment quantity
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    let cartItem;
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return NextResponse.json(
          { error: `Only ${product.stock} items in stock` },
          { status: 400 }
        );
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      if (quantity > product.stock) {
        return NextResponse.json(
          { error: `Only ${product.stock} items in stock` },
          { status: 400 }
        );
      }
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ item: cartItem }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart - update item quantity
 * Body: { productId: string, quantity: number }
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id, productId },
      });
      return NextResponse.json({ message: "Item removed from cart" });
    }

    // Check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || quantity > product.stock) {
      return NextResponse.json(
        { error: `Only ${product?.stock ?? 0} items in stock` },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      data: { quantity },
    });

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart - remove item or clear cart
 * Body: { productId?: string } - if no productId, clears entire cart
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { productId?: string } = {};
    try {
      body = await req.json();
    } catch {
      // No body = clear entire cart
    }

    if (body.productId) {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id, productId: body.productId },
      });
      return NextResponse.json({ message: "Item removed" });
    }

    // Clear entire cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to modify cart" },
      { status: 500 }
    );
  }
}
