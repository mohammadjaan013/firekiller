import nodemailer from "nodemailer";

const SITE_URL = process.env.NEXTAUTH_URL || "https://www.firekiller.in";
const SALES_EMAIL = "sales@oustfire.com";

/** "sent" = handed to the SMTP server; "skipped" = SMTP env vars missing, nothing sent */
export type EmailResult = "sent" | "skipped";

/** Customer-typed text goes into HTML - escape it so it can't inject markup/links */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true"; // false for port 587 (STARTTLS)
  
  console.log("[Email] Creating transporter:", { host, port, secure, user: process.env.SMTP_USER ? "***set***" : "NOT SET", pass: process.env.SMTP_PASS ? "***set***" : "NOT SET" });
  
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  gstAmount: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
}

export async function sendOrderEmailToAdmin(data: OrderEmailData): Promise<EmailResult> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("[Email] SMTP_USER/SMTP_PASS not set - admin email NOT sent for order", data.orderNumber);
    return "skipped";
  }

  console.log("[Email] Sending admin notification for order", data.orderNumber);

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(i.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#CC1F1F;color:#fff;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:22px">🔥 New Order Received</h1>
        <p style="margin:5px 0 0;font-size:14px;opacity:0.9">Order ${data.orderNumber}</p>
      </div>

      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none">
        <h2 style="color:#1e293b;font-size:16px;margin:0 0 12px">Customer Details</h2>
        <table style="width:100%;font-size:14px;color:#475569">
          <tr><td style="padding:4px 0"><strong>Name:</strong></td><td>${esc(data.customerName)}</td></tr>
          <tr><td style="padding:4px 0"><strong>Email:</strong></td><td>${esc(data.customerEmail)}</td></tr>
          <tr><td style="padding:4px 0"><strong>Phone:</strong></td><td>${esc(data.customerPhone)}</td></tr>
          <tr><td style="padding:4px 0;vertical-align:top"><strong>Address:</strong></td>
            <td>${esc(data.address.line1)}${data.address.line2 ? ", " + esc(data.address.line2) : ""}<br>${esc(data.address.city)}, ${esc(data.address.state)} - ${esc(data.address.pincode)}</td>
          </tr>
        </table>

        <h2 style="color:#1e293b;font-size:16px;margin:20px 0 12px">Order Items</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#475569">
          <thead>
            <tr style="background:#f8fafc">
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Product</th>
              <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e2e8f0">Qty</th>
              <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e2e8f0">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <table style="width:100%;font-size:14px;color:#475569;margin-top:16px">
          <tr><td style="padding:4px 0">Subtotal (excl. GST)</td><td style="text-align:right">₹${data.subtotal.toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:4px 0">GST (18%)</td><td style="text-align:right">₹${data.gstAmount.toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:4px 0">Shipping</td><td style="text-align:right">${data.shipping === 0 ? "FREE" : "₹" + data.shipping}</td></tr>
          ${data.discount ? `<tr><td style="padding:4px 0;color:#16a34a">Coupon discount</td><td style="text-align:right;color:#16a34a">-${inr(data.discount)}</td></tr>` : ""}
          <tr style="font-size:16px;font-weight:bold;color:#1e293b">
            <td style="padding:8px 0;border-top:2px solid #e2e8f0">Total</td>
            <td style="text-align:right;padding:8px 0;border-top:2px solid #e2e8f0">₹${data.total.toLocaleString("en-IN")}</td>
          </tr>
        </table>

        <p style="font-size:13px;color:#94a3b8;margin-top:16px">
          Payment: ${data.paymentMethod.toUpperCase()} ${data.paymentId ? `(${data.paymentId})` : ""}
        </p>
      </div>

      <div style="padding:16px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;border-radius:0 0 8px 8px;border:1px solid #eee;border-top:none">
        <p style="margin:0">This is an automated notification from FireKiller</p>
        <p style="margin:4px 0 0"><a href="${SITE_URL}/admin/orders" style="color:#CC1F1F">View in Admin Dashboard →</a></p>
      </div>
    </div>
  `;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"FireKiller Orders" <${process.env.SMTP_USER}>`,
      to: SALES_EMAIL,
      replyTo: data.customerEmail, // hit Reply in the sales inbox → answers the customer
      subject: `🔥 New Order #${data.orderNumber} - ₹${data.total.toLocaleString("en-IN")}`,
      html,
    });
    console.log("[Email] Admin email sent successfully:", info.messageId);
    return "sent";
  } catch (error) {
    console.error("[Email] Failed to send admin email:", error);
    throw error;
  }
}

/**
 * Send order confirmation email to the customer
 */
export async function sendOrderConfirmationToCustomer(data: OrderEmailData): Promise<EmailResult> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("[Email] SMTP_USER/SMTP_PASS not set - customer email NOT sent for order", data.orderNumber);
    return "skipped";
  }

  console.log("[Email] Sending customer confirmation for order", data.orderNumber, "to", data.customerEmail);

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee">${esc(i.name)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#CC1F1F;color:#fff;padding:24px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:24px">🔥 Order Confirmed!</h1>
        <p style="margin:8px 0 0;font-size:15px;opacity:0.9">Thank you for your purchase, ${esc(data.customerName)}!</p>
      </div>

      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none">
        <p style="font-size:15px;color:#475569;margin:0 0 16px">
          Your order <strong style="color:#1e293b">#${data.orderNumber}</strong> has been confirmed and is being processed.
        </p>

        <h2 style="color:#1e293b;font-size:16px;margin:0 0 12px">Order Summary</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#475569">
          <thead>
            <tr style="background:#f8fafc">
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Product</th>
              <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #e2e8f0">Qty</th>
              <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #e2e8f0">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <table style="width:100%;font-size:14px;color:#475569;margin-top:16px">
          <tr><td style="padding:4px 0">Subtotal</td><td style="text-align:right">₹${data.subtotal.toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:4px 0">GST (18%)</td><td style="text-align:right">₹${data.gstAmount.toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:4px 0">Shipping</td><td style="text-align:right">${data.shipping === 0 ? "FREE" : "₹" + data.shipping}</td></tr>
          ${data.discount ? `<tr><td style="padding:4px 0;color:#16a34a">Coupon discount</td><td style="text-align:right;color:#16a34a">-${inr(data.discount)}</td></tr>` : ""}
          <tr style="font-size:16px;font-weight:bold;color:#1e293b">
            <td style="padding:10px 0;border-top:2px solid #e2e8f0">Total Paid</td>
            <td style="text-align:right;padding:10px 0;border-top:2px solid #e2e8f0">₹${data.total.toLocaleString("en-IN")}</td>
          </tr>
        </table>

        <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0">
          <p style="margin:0;font-size:14px;color:#166534">
            <strong>📦 Shipping Address:</strong><br>
            ${esc(data.address.line1)}${data.address.line2 ? ", " + esc(data.address.line2) : ""}<br>
            ${esc(data.address.city)}, ${esc(data.address.state)} - ${esc(data.address.pincode)}
          </p>
        </div>

        <p style="font-size:13px;color:#94a3b8;margin-top:16px">
          Payment: ${data.paymentMethod.toUpperCase()} ${data.paymentId ? `(${data.paymentId})` : ""}
        </p>
      </div>

      <div style="padding:16px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;border-radius:0 0 8px 8px;border:1px solid #eee;border-top:none">
        <p style="margin:0">If you have any questions, reply to this email or contact us at sales@oustfire.com</p>
        <p style="margin:8px 0 0"><a href="${SITE_URL}/orders/track?order=${encodeURIComponent(data.orderNumber)}" style="color:#CC1F1F;font-weight:600">Track Your Order →</a></p>
      </div>
    </div>
  `;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"FireKiller" <${process.env.SMTP_USER}>`,
      to: data.customerEmail,
      replyTo: SALES_EMAIL, // the email says "reply to this email" - send replies to sales, not the SMTP account
      subject: `✅ Order Confirmed - #${data.orderNumber} | FireKiller`,
      html,
    });
    console.log("[Email] Customer email sent successfully:", info.messageId);
    return "sent";
  } catch (error) {
    console.error("[Email] Failed to send customer email:", error);
    throw error;
  }
}
