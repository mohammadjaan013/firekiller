import { NextRequest, NextResponse } from "next/server";
import { getAvailableCouriers } from "@/lib/shiprocket";

const PICKUP_PINCODE = "400705"; // Juinagar, Navi Mumbai
const PACKAGE_WEIGHT = 0.5; // kg — average for 1 FireKiller unit

/**
 * GET /api/shiprocket/rates?pincode=XXXXXX
 * Returns the cheapest available shipping rate for a delivery pincode.
 * Falls back to ₹0 (free) if Shiprocket is not configured or pincode not serviceable.
 */
export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pincode");

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    // Shiprocket not configured — fall back to free shipping
    return NextResponse.json({ rate: 0, courier: null, etd: null });
  }

  try {
    const couriers = await getAvailableCouriers({
      pickup_postcode: PICKUP_PINCODE,
      delivery_postcode: pincode,
      weight: PACKAGE_WEIGHT,
      cod: false,
    });

    if (!couriers.length) {
      return NextResponse.json({ rate: 0, courier: null, etd: null });
    }

    // Pick cheapest available courier
    const cheapest = couriers.reduce((a, b) => (a.rate <= b.rate ? a : b));

    return NextResponse.json({
      rate: Math.round(cheapest.rate),
      courier: cheapest.courier_name,
      etd: cheapest.etd,
    });
  } catch (err) {
    console.error("Shiprocket rates error:", err);
    // Graceful fallback — don't block checkout
    return NextResponse.json({ rate: 0, courier: null, etd: null });
  }
}
