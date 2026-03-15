import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

/**
 * POST /api/checkout
 * Places an order after Razorpay payment verification.
 * Works for both logged-in users (server cart) and guest users (client cart).
 *
 * Body: {
 *   address: { name, phone, email, line1, line2, city, state, pincode },
 *   razorpayOrderId: string,
 *   razorpayPaymentId: string,
 *   items: [{ productId, slug, name, quantity, price }],
 *   subtotal: number,
 *   shipping: number,
 *   total: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      address,
      razorpayOrderId,
      razorpayPaymentId,
      items,
      subtotal,
      shipping,
      total,
    } = body;

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

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { error: "Payment details are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

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
      // Find DB product by slug (client uses numeric IDs but DB uses cuid)
      const dbProduct = await prisma.product.findUnique({
        where: { slug: item.slug },
      });

      if (dbProduct) {
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
        discount: 0,
        total,
        paymentMethod: "razorpay",
        paymentId: razorpayPaymentId,
        razorpayOrderId,
        paymentStatus: "paid",
        status: "CONFIRMED",
        items:
          orderItems.length > 0
            ? { create: orderItems }
            : undefined,
      },
    });

    // Send WhatsApp order confirmation (fire-and-forget)
    sendOrderConfirmation({
      phone: address.phone,
      customerName: address.name,
      orderNumber: order.orderNumber,
      total: order.total,
      orderId: order.id,
    }).catch((err) => console.error("WhatsApp order confirmation error:", err));

    // Prepare email data
    const GST_RATE = 0.18;
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
      items: items.map((item: { name: string; quantity: number; price: number }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      gstAmount,
      shipping,
      total: order.total,
      paymentMethod: "razorpay",
      paymentId: razorpayPaymentId,
    };

    // Send both emails in parallel and AWAIT them so Vercel doesn't kill the function early
    try {
      await Promise.all([
        sendOrderEmailToAdmin(emailData).then(() =>
          prisma.order.update({
            where: { id: order.id },
            data: { emailSentToAdmin: true, customerEmail: address.email },
          }).catch((e) => console.error("Failed to update email flag:", e))
        ),
        sendOrderConfirmationToCustomer(emailData),
      ]);
    } catch (err) {
      console.error("Email sending error (non-blocking):", err);
    }

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
