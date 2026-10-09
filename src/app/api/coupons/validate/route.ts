import { NextRequest, NextResponse } from "next/server";
import { evaluateCoupon } from "@/lib/pricing";

/**
 * POST /api/coupons/validate - validate a coupon code
 * Body: { code: string, subtotal: number }
 * The discount shown here is for display only - checkout re-validates the
 * coupon server-side against the server-computed cart total.
 */
export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const result = await evaluateCoupon(String(code), Number(subtotal) || 0);
    if (!result.ok) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: result.status }
      );
    }

    const { coupon, discount } = result;
    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder,
      },
      discount,
    });
  } catch (error) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
