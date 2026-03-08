import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { trackShipment } from "@/lib/shiprocket";

/**
 * GET /api/shiprocket/track?orderId=xxx
 * Returns tracking info for an order.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = req.nextUrl.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.awbCode) {
      return NextResponse.json({
        status: order.status,
        message: "Shipment is being prepared. Tracking will be available once dispatched.",
      });
    }

    const tracking = await trackShipment(order.awbCode);

    return NextResponse.json({
      awbCode: order.awbCode,
      trackingUrl: order.trackingUrl,
      ...tracking,
    });
  } catch (error) {
    console.error("Track shipment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking" },
      { status: 500 }
    );
  }
}
