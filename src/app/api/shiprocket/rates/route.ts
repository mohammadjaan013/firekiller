import { NextRequest, NextResponse } from "next/server";
import { getShippingRate } from "@/lib/pricing";

/**
 * GET /api/shiprocket/rates?pincode=XXXXXX
 * Returns the cheapest available shipping rate for a delivery pincode.
 * Falls back to ₹0 (free) if Shiprocket is not configured or pincode not serviceable.
 * Same function the server uses when pricing the order, so display == charge.
 */
export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pincode");

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  return NextResponse.json(await getShippingRate(pincode));
}
