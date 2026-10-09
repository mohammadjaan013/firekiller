import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { computeOrderTotals, totalsToNotes, PricingError } from "@/lib/pricing";

/**
 * POST /api/razorpay/order
 * Prices the cart on the server and creates a Razorpay order for THAT amount.
 * The browser's own total is only used to detect that what the customer is
 * looking at is out of date - it never decides what gets charged.
 *
 * Body: {
 *   items: [{ slug: string, quantity: number }],
 *   couponCode?: string,
 *   pincode?: string,
 *   expectedTotal: number   // total shown on the checkout page (₹)
 * }
 *
 * 409 → the displayed total is stale; body.totals has the correct breakdown.
 */
export async function POST(req: NextRequest) {
  try {
    const { items, couponCode, pincode, expectedTotal } = await req.json();

    const totals = await computeOrderTotals({ items, couponCode, pincode });

    if (totals.total <= 0) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    if (Math.abs(totals.total - Number(expectedTotal)) > 0.01) {
      return NextResponse.json(
        { error: "Your order total has changed. Please review it and try again.", totals },
        { status: 409 }
      );
    }

    const order = await getRazorpay().orders.create({
      amount: Math.round(totals.total * 100), // Razorpay uses paise
      currency: "INR",
      receipt: `fk_${Date.now()}`,
      notes: totalsToNotes(totals),
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    if (error instanceof PricingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
