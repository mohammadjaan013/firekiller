import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

/**
 * POST /api/razorpay/order
 * Creates a Razorpay order that the frontend opens in the checkout modal.
 *
 * Body: { amount: number (in ₹), receipt?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
