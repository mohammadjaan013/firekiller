import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";
import { notesToTotals, GST_RATE } from "@/lib/pricing";
import { sendOrderConfirmation } from "@/lib/interakt";
import { sendOrderEmailToAdmin, sendOrderConfirmationToCustomer } from "@/lib/email";

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

/** Razorpay's documented proof of payment: HMAC-SHA256("order_id|payment_id", key_secret) */
function isValidPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * POST /api/checkout
 * Places an order after a successful Razorpay payment.
 * Works for both logged-in users and guest users.
 *
 * Security: the payment signature is verified HERE, and the items / amounts
 * recorded come from the Razorpay order the server priced (its `notes`) -
 * never from the request body. The body only supplies the delivery address.
 *
 * Body: {
 *   address: { name, phone, email, line1, line2, city, state, pincode },
 *   razorpayOrderId: string,
 *   razorpayPaymentId: string,
 *   razorpaySignature: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    // Validate required fields
    if (
      !address?.name ||
      !address?.phone ||
      !address?.email ||
      !address?.line1 ||
      !address?.city ||
      !address?.state ||
      !address?.pincode
    ) {
      return NextResponse.json(
        { error: "Complete address is required" },
        { status: 400 }
      );
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Payment details are required" },
        { status: 400 }
      );
    }

    if (!isValidPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Idempotent: a retry / double-submit for the same payment returns the same order
    const existing = await prisma.order.findFirst({ where: { razorpayOrderId } });
    if (existing) {
      return NextResponse.json({
        orderNumber: existing.orderNumber,
        orderId: existing.id,
      });
    }

    // What was actually priced and charged - set server-side in /api/razorpay/order
    const rzpOrder = await getRazorpay().orders.fetch(razorpayOrderId);
    const priced = notesToTotals(rzpOrder.notes as Record<string, string | number>);
    if (Math.round(priced.total * 100) !== Number(rzpOrder.amount)) {
      console.error(`Razorpay order ${razorpayOrderId}: notes total ${priced.total} != amount ${rzpOrder.amount}`);
      return NextResponse.json({ error: "Order amount mismatch" }, { status: 400 });
    }
    const { lines: items, subtotal, shipping, discount, total } = priced;

    // Find or create a guest user by email
    let user = await prisma.user.findUnique({
      where: { email: address.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: address.email,
          name: address.name,
          phone: address.phone,
        },
      });
    }

    // Create/update address
    const savedAddress = await prisma.address.create({
      data: {
        userId: user.id,
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true,
      },
    });

    const orderNumber = generateOrderNumber();

    // Create order items - map client product IDs to DB product IDs
    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
      total: number;
    }[] = [];

    for (const item of items) {
      // Find DB product by slug (catalogue uses slugs, DB uses cuid ids)
      const dbProduct = await prisma.product.findUnique({
        where: { slug: item.slug },
      });

      if (!dbProduct) {
        // Order is still created (the customer has paid) - but flag it loudly
        console.error(`Order ${orderNumber}: product "${item.slug}" not found in DB - line not linked`);
      } else {
        orderItems.push({
          productId: dbProduct.id,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        });
      }
    }

    // If no DB products found (products not seeded to DB yet),
    // still create order with just the financial data
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        addressId: savedAddress.id,
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod: "razorpay",
        paymentId: razorpayPaymentId,
        razorpayOrderId,
        paymentStatus: "paid",
        status: "CONFIRMED",
        customerEmail: address.email,
        items:
          orderItems.length > 0
            ? { create: orderItems }
            : undefined,
      },
    });

    // Count the coupon use (enforces usageLimit for later orders)
    if (priced.couponCode) {
      await prisma.coupon
        .update({ where: { code: priced.couponCode }, data: { usedCount: { increment: 1 } } })
        .catch((e) => console.error("Failed to increment coupon usage:", e));
    }

    // Prepare email data
    const gstAmount = Math.round(subtotal * GST_RATE);

    const emailData = {
      orderNumber: order.orderNumber,
      customerName: address.name,
      customerEmail: address.email,
      customerPhone: address.phone,
      address: {
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      gstAmount,
      shipping,
      discount,
      total: order.total,
      paymentMethod: "razorpay",
      paymentId: razorpayPaymentId,
    };

    // Notifications: run in parallel and AWAIT them all - Vercel can freeze the
    // function once the response is sent, so nothing here may be fire-and-forget.
    // allSettled: one failing channel never blocks the others or the order.
    const [adminEmail, customerEmail, whatsapp] = await Promise.allSettled([
      sendOrderEmailToAdmin(emailData),
      sendOrderConfirmationToCustomer(emailData),
      sendOrderConfirmation({
        phone: address.phone,
        customerName: address.name,
        orderNumber: order.orderNumber,
        total: order.total,
        orderId: order.id,
      }),
    ]);

    // Only mark as sent if it really was ("skipped" = SMTP not configured)
    if (adminEmail.status === "fulfilled" && adminEmail.value === "sent") {
      await prisma.order
        .update({ where: { id: order.id }, data: { emailSentToAdmin: true } })
        .catch((e) => console.error("Failed to update email flag:", e));
    }
    if (adminEmail.status === "rejected") console.error(`Order ${orderNumber}: admin email failed:`, adminEmail.reason);
    if (customerEmail.status === "rejected") console.error(`Order ${orderNumber}: customer email failed:`, customerEmail.reason);
    if (whatsapp.status === "rejected") console.error(`Order ${orderNumber}: WhatsApp failed:`, whatsapp.reason);

    return NextResponse.json({
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
