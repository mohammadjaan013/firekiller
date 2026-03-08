import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  createShiprocketOrder,
  generateAWB,
  requestPickup,
  type ShiprocketOrderPayload,
} from "@/lib/shiprocket";
import { sendShippingUpdate } from "@/lib/interakt";

/**
 * POST /api/shiprocket/ship
 * Creates a Shiprocket shipment for a confirmed order.
 *
 * Body: { orderId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Order is not paid" },
        { status: 400 }
      );
    }

    if (order.shiprocketOrderId) {
      return NextResponse.json(
        { error: "Shipment already created" },
        { status: 400 }
      );
    }

    // Build Shiprocket payload
    const now = new Date();
    const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const nameParts = (order.address.name || "Customer").split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Calculate total weight (FireKiller = 0.5kg per unit, PanSafe = 0.1kg per unit)
    let totalWeight = 0;
    const orderItems = order.items.map((item) => {
      const weight = item.product.weight || 0.5;
      totalWeight += weight * item.quantity;
      return {
        name: item.product.name,
        sku: item.product.sku,
        units: item.quantity,
        selling_price: item.price,
      };
    });

    const payload: ShiprocketOrderPayload = {
      order_id: order.orderNumber,
      order_date: orderDate,
      pickup_location: "Primary", // Must match name in Shiprocket dashboard
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.address.line1,
      billing_address_2: order.address.line2 || "",
      billing_city: order.address.city,
      billing_pincode: order.address.pincode,
      billing_state: order.address.state,
      billing_country: "India",
      billing_email: order.user.email,
      billing_phone: order.address.phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: order.subtotal,
      length: 30,
      breadth: 20,
      height: 15,
      weight: Math.max(0.5, totalWeight),
    };

    // Create order in Shiprocket
    const srOrder = await createShiprocketOrder(payload);

    // Try auto-assigning a courier and generating AWB
    let awbCode = "";
    try {
      const awbResult = await generateAWB(srOrder.shipment_id);
      awbCode = awbResult.awb_code;

      // Request pickup
      await requestPickup(srOrder.shipment_id);
    } catch (e) {
      // AWB/pickup may fail if Shiprocket needs manual courier assignment
      console.warn("Auto AWB/pickup skipped:", e);
    }

    // Update order with Shiprocket details
    const trackingUrl = awbCode
      ? `https://shiprocket.co/tracking/${awbCode}`
      : null;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        shiprocketOrderId: String(srOrder.order_id),
        shiprocketShipmentId: String(srOrder.shipment_id),
        awbCode: awbCode || null,
        trackingUrl,
        status: "PROCESSING",
      },
    });

    // Send WhatsApp shipping update (fire-and-forget)
    if (trackingUrl) {
      sendShippingUpdate({
        phone: order.address.phone,
        customerName: order.address.name,
        orderNumber: order.orderNumber,
        trackingUrl,
        orderId: order.id,
      }).catch((err) => console.error("WhatsApp shipping update error:", err));
    }

    return NextResponse.json({
      shiprocketOrderId: srOrder.order_id,
      shipmentId: srOrder.shipment_id,
      awbCode,
      status: "processing",
    });
  } catch (error) {
    console.error("Shiprocket ship error:", error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}
