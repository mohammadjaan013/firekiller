import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { sendCODVerification } from "@/lib/interakt";

/**
 * POST /api/orders/cod-verify
 * Sends a COD verification WhatsApp message to the customer.
 * Admin-only endpoint.
 *
 * Body: { orderId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.codVerified) {
      return NextResponse.json(
        { error: "Already verified" },
        { status: 400 }
      );
    }

    const result = await sendCODVerification({
      phone: order.address.phone,
      customerName: order.address.name,
      orderNumber: order.orderNumber,
      total: order.total,
      orderId: order.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send verification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "COD verification sent" });
  } catch (error) {
    console.error("COD verify error:", error);
    return NextResponse.json(
      { error: "Failed to send COD verification" },
      { status: 500 }
    );
  }
}
