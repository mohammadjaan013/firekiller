import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

async function escapeHtml(str: string): Promise<string> {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const safeName = await escapeHtml(data.name);
  const safeEmail = await escapeHtml(data.email);
  const safePhone = data.phone ? await escapeHtml(data.phone) : null;
  const safeSubject = await escapeHtml(data.subject);
  const safeMessage = await escapeHtml(data.message);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#CC1F1F;color:#fff;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:20px">📩 New Contact Form Message</h1>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;font-size:14px;color:#475569">
        <table style="width:100%">
          <tr><td style="padding:4px 0;font-weight:bold;width:80px">Name:</td><td>${safeName}</td></tr>
          <tr><td style="padding:4px 0;font-weight:bold">Email:</td><td>${safeEmail}</td></tr>
          ${safePhone ? `<tr><td style="padding:4px 0;font-weight:bold">Phone:</td><td>${safePhone}</td></tr>` : ""}
          <tr><td style="padding:4px 0;font-weight:bold">Subject:</td><td>${safeSubject}</td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:6px;border-left:3px solid #CC1F1F">
          <strong>Message:</strong>
          <p style="margin:8px 0 0;white-space:pre-wrap">${safeMessage}</p>
        </div>
      </div>
      <div style="padding:12px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;border-radius:0 0 8px 8px;border:1px solid #eee;border-top:none">
        Reply to this email to respond directly to the sender.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"FireKiller Contact" <sales@oustfire.com>`,
    to: "sales@oustfire.com",
    replyTo: data.email,
    subject: `Contact Form: ${safeSubject} - ${safeName}`,
    html,
  });
}

/**
 * POST /api/contact - submit a contact message
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, subject, message" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    // Send email notification to sales@oustfire.com (fire-and-forget)
    sendContactEmail({ name, email, phone, subject, message }).catch((err) =>
      console.error("Contact form email error:", err)
    );

    return NextResponse.json(
      { message: "Message sent successfully", contact },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
