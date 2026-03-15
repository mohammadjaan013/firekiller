import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/account/last-address
 * Returns the logged-in user's profile (name, email, phone)
 * and their most recent shipping address (from last order).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ user: null, address: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true },
    });

    // Get the most recent address used in an order
    const lastOrder = await prisma.order.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { address: true },
    });

    return NextResponse.json({
      user: user ?? null,
      address: lastOrder?.address ?? null,
    });
  } catch (error) {
    console.error("GET /api/account/last-address error:", error);
    return NextResponse.json({ user: null, address: null });
  }
}
