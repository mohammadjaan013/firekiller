import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/orders/cod-confirm
 * Webhook for Interakt - customer replies YES/CONFIRM to verify COD,
 * or NO/CANCEL to cancel the order.
 *
 * Interakt sends a payload with the customer's reply.
 * Expected body from Interakt webhook:
 * {
 *   "data": {
 *     "message": { "text": "YES" | "NO" },
 *     "customer": { "phone_number": "91XXXXXXXXXX" }
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messageText =
      body?.data?.message?.text?.trim()?.toUpperCase() || "";
    const rawPhone = body?.data?.customer?.phone_number || "";

    // Normalize phone: remove country code prefix, keep last 10 digits
    const phone = rawPhone.replace(/\D/g, "").slice(-10);

    if (!phone || !messageText) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // Find the most recent unverified order for this phone number
    const order = await prisma.order.findFirst({
      where: {
        address: { phone: { endsWith: phone } },
        codVerified: false,
        codVerificationSentAt: { not: null },
        paymentMethod: "cod",
      },
      orderBy: { createdAt: "desc" },
      include: { address: true },
    });

    if (!order) {
      return NextResponse.json({ status: "no_pending_order" });
    }

    const isConfirm = ["YES", "CONFIRM", "Y", "HAA", "HAAN"].includes(
      messageText
    );
    const isCancel = ["NO", "CANCEL", "N", "NAHI"].includes(messageText);

    if (isConfirm) {
      await prisma.order.update({
        where: { id: order.id },
        data: { codVerified: true, status: "CONFIRMED" },
      });

      return NextResponse.json({
        status: "confirmed",
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    }

    if (isCancel) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({
        status: "cancelled",
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    }

    // Unrecognized response - do nothing
    return NextResponse.json({ status: "unrecognized_reply" });
  } catch (error) {
    console.error("COD confirm webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
