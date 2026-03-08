import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * GET /api/admin/cod-orders
 * Returns all COD orders for the admin dashboard.
 */
export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { paymentMethod: "cod" },
      include: {
        address: { select: { name: true, phone: true, city: true } },
        items: {
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/admin/cod-orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch COD orders" },
      { status: 500 }
    );
  }
}
