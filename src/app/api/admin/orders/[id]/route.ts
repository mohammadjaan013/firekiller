import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { sendOrderEmailToAdmin, sendOrderConfirmationToCustomer } from "@/lib/email";
import { GST_RATE } from "@/lib/pricing";

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
 * POST /api/admin/orders/[id] - (re)send order emails
 * Body: { action: "send_email" }           → order details to sales@oustfire.com
 *       { action: "send_customer_email" }  → order confirmation to the customer
 * On failure the real reason is returned (admin-only), e.g. missing SMTP env vars
 * or the SMTP server's error, so problems can be diagnosed from the dashboard.
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

    if (action !== "send_email" && action !== "send_customer_email") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        items: { include: { product: { select: { name: true } } } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // order.subtotal is stored excluding GST (see /api/checkout)
    const emailData = {
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
      subtotal: order.subtotal,
      gstAmount: Math.round(order.subtotal * GST_RATE),
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod || "razorpay",
      paymentId: order.paymentId || undefined,
    };

    if (action === "send_customer_email" && !emailData.customerEmail) {
      return NextResponse.json({ error: "This order has no customer email" }, { status: 400 });
    }

    let result;
    try {
      result =
        action === "send_email"
          ? await sendOrderEmailToAdmin(emailData)
          : await sendOrderConfirmationToCustomer(emailData);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: `Email failed: ${reason}` }, { status: 502 });
    }

    if (result === "skipped") {
      return NextResponse.json(
        { error: "Email is not configured on the server: SMTP_USER / SMTP_PASS environment variables are missing" },
        { status: 503 }
      );
    }

    if (action === "send_email") {
      await prisma.order.update({ where: { id }, data: { emailSentToAdmin: true } });
    }

    return NextResponse.json({
      success: true,
      message: action === "send_email" ? "Email sent to sales@oustfire.com" : `Confirmation sent to ${emailData.customerEmail}`,
    });
  } catch (error) {
    console.error("POST /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
