import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function sendVendorEmail(data: {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  businessType: string;
  message?: string | null;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const n = escapeHtml(data.name);
  const co = escapeHtml(data.company);
  const em = escapeHtml(data.email);
  const ph = escapeHtml(data.phone);
  const ci = escapeHtml(data.city);
  const bt = escapeHtml(data.businessType);
  const msg = data.message ? escapeHtml(data.message) : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#CC1F1F;color:#fff;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:20px">🤝 New Vendor Enquiry</h1>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;font-size:14px;color:#475569">
        <table style="width:100%">
          <tr><td style="padding:4px 0;font-weight:bold;width:110px">Name:</td><td>${n}</td></tr>
          <tr><td style="padding:4px 0;font-weight:bold">Company:</td><td>${co}</td></tr>
          <tr><td style="padding:4px 0;font-weight:bold">Email:</td><td>${em}</td></tr>
          <tr><td style="padding:4px 0;font-weight:bold">Phone:</td><td>${ph}</td></tr>
          <tr><td style="padding:4px 0;font-weight:bold">City:</td><td>${ci}</td></tr>
          <tr><td style="padding:4px 0;font-weight:bold">Business Type:</td><td>${bt}</td></tr>
        </table>
        ${msg ? `<div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:6px;border-left:3px solid #CC1F1F"><strong>Message:</strong><p style="margin:8px 0 0;white-space:pre-wrap">${msg}</p></div>` : ""}
      </div>
      <div style="padding:12px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;border-radius:0 0 8px 8px;border:1px solid #eee;border-top:none">
        Reply to this email to respond directly to the vendor.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"FireKiller" <sales@oustfire.com>`,
    to: "sales@oustfire.com",
    replyTo: data.email,
    subject: `Vendor Enquiry: ${escapeHtml(data.company)} – ${bt}`,
    html,
  });
}

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

    // Send email notification (awaited so Vercel doesn't kill the function early)
    try {
      await sendVendorEmail({ name, company, email, phone, city, businessType, message });
    } catch (emailErr) {
      console.error("Vendor enquiry email error:", emailErr);
    }

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
