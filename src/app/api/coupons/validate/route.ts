import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/coupons/validate — validate a coupon code
 * Body: { code: string, subtotal: number }
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

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check active
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: "This coupon is no longer active" },
        { status: 400 }
      );
    }

    // Check expiry
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: "This coupon has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: "This coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check minimum order
    if (coupon.minOrder && subtotal && subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order of ₹${coupon.minOrder} required`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (subtotal) {
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
    }

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
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
