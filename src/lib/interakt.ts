import { prisma } from "@/lib/db";

const INTERAKT_API_URL = "https://api.interakt.ai/v1/public/message/";

interface InteraktPayload {
  countryCode: string;
  phoneNumber: string;
  callbackData?: string;
  type: "Template";
  template: {
    name: string;
    languageCode: string;
    headerValues?: string[];
    bodyValues?: string[];
    buttonValues?: Record<string, string[]>;
  };
}

async function sendInteraktMessage(
  payload: InteraktPayload,
  orderId?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.INTERAKT_API_KEY;
  if (!apiKey) {
    console.warn("INTERAKT_API_KEY not set — skipping WhatsApp message");
    return { success: false, error: "API key not configured" };
  }

  try {
    const res = await fetch(INTERAKT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const success = res.ok;

    // Log to DB
    await prisma.whatsappLog.create({
      data: {
        phone: payload.phoneNumber,
        templateName: payload.template.name,
        message: JSON.stringify(payload.template.bodyValues),
        status: success ? "SENT" : "FAILED",
        orderId: orderId || null,
      },
    });

    if (!success) {
      console.error("Interakt API error:", data);
      return { success: false, error: data?.message || "Failed to send" };
    }

    return { success: true };
  } catch (error) {
    console.error("Interakt send error:", error);

    await prisma.whatsappLog.create({
      data: {
        phone: payload.phoneNumber,
        templateName: payload.template.name,
        message: JSON.stringify(payload.template.bodyValues),
        status: "FAILED",
        orderId: orderId || null,
      },
    });

    return { success: false, error: "Network error" };
  }
}

/**
 * Send order confirmation WhatsApp message
 */
export async function sendOrderConfirmation({
  phone,
  customerName,
  orderNumber,
  total,
  orderId,
}: {
  phone: string;
  customerName: string;
  orderNumber: string;
  total: number;
  orderId: string;
}) {
  return sendInteraktMessage(
    {
      countryCode: "+91",
      phoneNumber: phone.replace(/^\+91/, ""),
      type: "Template",
      template: {
        name: "order_confirmation",
        languageCode: "en",
        bodyValues: [customerName, orderNumber, `₹${total.toLocaleString("en-IN")}`],
      },
    },
    orderId
  );
}

/**
 * Send COD verification WhatsApp message
 */
export async function sendCODVerification({
  phone,
  customerName,
  orderNumber,
  total,
  orderId,
}: {
  phone: string;
  customerName: string;
  orderNumber: string;
  total: number;
  orderId: string;
}) {
  // Update the order to mark COD verification sent
  await prisma.order.update({
    where: { id: orderId },
    data: { codVerificationSentAt: new Date() },
  });

  return sendInteraktMessage(
    {
      countryCode: "+91",
      phoneNumber: phone.replace(/^\+91/, ""),
      type: "Template",
      template: {
        name: "cod_verification",
        languageCode: "en",
        bodyValues: [customerName, orderNumber, `₹${total.toLocaleString("en-IN")}`],
      },
    },
    orderId
  );
}

/**
 * Send shipping update WhatsApp message
 */
export async function sendShippingUpdate({
  phone,
  customerName,
  orderNumber,
  trackingUrl,
  orderId,
}: {
  phone: string;
  customerName: string;
  orderNumber: string;
  trackingUrl: string;
  orderId: string;
}) {
  return sendInteraktMessage(
    {
      countryCode: "+91",
      phoneNumber: phone.replace(/^\+91/, ""),
      type: "Template",
      template: {
        name: "shipping_update",
        languageCode: "en",
        bodyValues: [customerName, orderNumber, trackingUrl],
      },
    },
    orderId
  );
}

/**
 * Send abandoned cart reminder WhatsApp message
 */
export async function sendAbandonedCartReminder({
  phone,
  customerName,
  productNames,
}: {
  phone: string;
  customerName: string;
  productNames: string;
}) {
  return sendInteraktMessage({
    countryCode: "+91",
    phoneNumber: phone.replace(/^\+91/, ""),
    type: "Template",
    template: {
      name: "abandoned_cart",
      languageCode: "en",
      bodyValues: [customerName, productNames],
    },
  });
}
