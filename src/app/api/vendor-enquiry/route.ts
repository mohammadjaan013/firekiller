import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/vendor-enquiry - submit a vendor/distributor enquiry
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, city, businessType, message } = body;

    // Validation
    if (!name || !company || !email || !phone || !city || !businessType) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, company, email, phone, city, businessType",
        },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.vendorEnquiry.create({
      data: {
        name,
        company,
        email,
        phone,
        city,
        businessType,
        message: message || null,
      },
    });

    return NextResponse.json(
      { message: "Enquiry submitted successfully", enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/vendor-enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
