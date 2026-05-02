import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/orders/track?order=FK-XXXX&email=user@example.com
 * Public endpoint — no auth required.
 * Returns order details only if both order number AND email match.
 * Safe: email is the second factor, so guessing order numbers doesn't expose data.
 */
export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("order")?.trim().toUpperCase();
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Order number and email are required" },
      { status: 400 }
    );
  }

  // Basic email format check to avoid DB queries on garbage input
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      address: true,
      items: true,
      user: { select: { email: true } },
    },
  });

  // Don't reveal whether order exists — same 404 for both "not found" and "wrong email"
  if (!order || order.user.email.toLowerCase() !== email) {
    return NextResponse.json(
      { error: "No order found with that order number and email combination." },
      { status: 404 }
    );
  }

  // Build item names from order items (product may not be seeded — fall back to price display)
  const items = await Promise.all(
    order.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });
      return {
        name: product?.name ?? "Product",
        quantity: item.quantity,
        price: item.price,
      };
    })
  );

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    createdAt: order.createdAt,
    awbCode: order.awbCode,
    trackingUrl: order.trackingUrl,
    address: {
      name: order.address.name,
      line1: order.address.line1,
      line2: order.address.line2,
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.pincode,
      phone: order.address.phone,
    },
    items,
  });
}
