import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { sendOrderEmailToAdmin } from "@/lib/email";

/**
 * GET /api/admin/orders/[id] - get order details
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
        whatsappLogs: { orderBy: { sentAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("GET /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/orders/[id] - update order status
 * Body: { status?, paymentStatus?, notes?, trackingUrl?, awbCode? }
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
    const { status, paymentStatus, notes, trackingUrl, awbCode } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
    if (awbCode) updateData.awbCode = awbCode;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("PUT /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

/**
 * POST /api/admin/orders/[id] - resend email notification
 * Body: { action: "send_email" }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { action } = await req.json();

    if (action === "send_email") {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: true,
          items: { include: { product: { select: { name: true, price: true, gstRate: true } } } },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const GST_RATE = 0.18;
      const baseSubtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const gstAmount = Math.round(baseSubtotal * GST_RATE);

      await sendOrderEmailToAdmin({
        orderNumber: order.orderNumber,
        customerName: order.address?.name || order.user?.name || "Customer",
        customerEmail: order.customerEmail || order.user?.email || "",
        customerPhone: order.address?.phone || order.user?.phone || "",
        address: {
          line1: order.address?.line1 || "",
          line2: order.address?.line2 || undefined,
          city: order.address?.city || "",
          state: order.address?.state || "",
          pincode: order.address?.pincode || "",
        },
        items: order.items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal: baseSubtotal,
        gstAmount,
        shipping: order.shipping,
        total: order.total,
        paymentMethod: order.paymentMethod || "razorpay",
        paymentId: order.paymentId || undefined,
      });

      await prisma.order.update({
        where: { id },
        data: { emailSentToAdmin: true },
      });

      return NextResponse.json({ success: true, message: "Email sent" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
