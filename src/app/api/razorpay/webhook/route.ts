import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

/**
 * POST /api/razorpay/webhook
 * Handles Razorpay webhook events (payment.captured, payment.failed, refund.created, etc.)
 *
 * Configure this URL in your Razorpay Dashboard → Settings → Webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    if (process.env.RAZORPAY_WEBHOOK_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET !== "your_webhook_secret") {
      if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );

      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    switch (eventType) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            paymentStatus: "paid",
            paymentId: payment.id,
            status: "CONFIRMED",
          },
        });
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            paymentStatus: "failed",
          },
        });
        break;
      }

      case "refund.created": {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;

        await prisma.order.updateMany({
          where: { paymentId },
          data: {
            paymentStatus: "refunded",
            status: "REFUNDED",
          },
        });
        break;
      }

      default:
        // Unhandled event type — acknowledge anyway
        break;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
