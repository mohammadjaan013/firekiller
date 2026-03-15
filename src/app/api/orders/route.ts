import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Generate a unique order number: FK-YYYYMMDD-XXXX
 */
function generateOrderNumber(): string {
  const date = new Date();
  const ymd =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FK-${ymd}-${rand}`;
}

/**
 * GET /api/orders - list current user's orders
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders - place a new order
 * Body: {
 *   addressId: string,
 *   paymentMethod?: string,
 *   paymentId?: string,
 *   couponCode?: string,
 *   notes?: string
 * }
 * Takes items from the user's server-side cart.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId, paymentMethod, paymentId, couponCode, notes } =
      await req.json();

    if (!addressId) {
      return NextResponse.json(
        { error: "Delivery address is required" },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Invalid address" },
        { status: 400 }
      );
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Verify stock & calculate totals
    let subtotal = 0;
    const orderItems: { productId: string; quantity: number; price: number; total: number }[] = [];

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            error: `"${item.product.name}" only has ${item.product.stock} in stock`,
          },
          { status: 400 }
        );
      }
      const lineTotal = item.product.price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        total: lineTotal,
      });
    }

    // Shipping: free above ₹999, else ₹99
    const shipping = subtotal > 999 ? 0 : 99;

    // Apply coupon discount
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
        (!coupon.minOrder || subtotal >= coupon.minOrder)
      ) {
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }

        // Increment usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const total = subtotal + shipping - discount;

    // Create order + items + decrement stock + clear cart - all in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user!.id,
          addressId,
          subtotal,
          shipping,
          discount,
          total,
          paymentMethod: paymentMethod || null,
          paymentId: paymentId || null,
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: { include: { product: true } },
          address: true,
        },
      });

      // Decrement stock for each product
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user!.id },
      });

      return created;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
