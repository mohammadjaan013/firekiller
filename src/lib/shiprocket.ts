/**
 * Shiprocket API Integration
 * Docs: https://apidocs.shiprocket.in/
 *
 * Flow:
 *  1. Authenticate → get token
 *  2. Create order → Shiprocket assigns it
 *  3. Request pickup → Shiprocket arranges courier
 *  4. Track shipment → get AWB + tracking URL
 */

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Authenticate with Shiprocket and cache the token (valid ~10 days).
 */
export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket auth failed: ${text}`);
  }

  const data = await res.json();

  // Cache for 9 days (Shiprocket tokens last ~10 days)
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
  };

  return data.token;
}

/**
 * Helper to make authenticated Shiprocket API calls.
 */
async function shiprocketFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getShiprocketToken();
  return fetch(`${SHIPROCKET_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

/* ── Interfaces ────────────────────────────────────────── */

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
}

export interface ShiprocketOrderPayload {
  order_id: string; // your internal order number
  order_date: string; // YYYY-MM-DD HH:mm
  pickup_location: string; // must match a pickup location in Shiprocket dashboard
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_phone?: string;
  order_items: ShiprocketOrderItem[];
  payment_method: "Prepaid" | "COD";
  sub_total: number;
  length: number; // cm
  breadth: number; // cm
  height: number; // cm
  weight: number; // kg
}

/**
 * Create an order in Shiprocket.
 */
export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload
): Promise<{ order_id: number; shipment_id: number; status: string }> {
  const res = await shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket create order failed: ${text}`);
  }

  return res.json();
}

/**
 * Generate AWB (airway bill) for a shipment — assigns a courier.
 */
export async function generateAWB(
  shipmentId: number,
  courierId?: number
): Promise<{ awb_code: string; courier_name: string }> {
  const body: Record<string, unknown> = { shipment_id: shipmentId };
  if (courierId) body.courier_id = courierId;

  const res = await shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket AWB generation failed: ${text}`);
  }

  const data = await res.json();
  return {
    awb_code: data.response?.data?.awb_code || "",
    courier_name: data.response?.data?.courier_name || "",
  };
}

/**
 * Request pickup for a shipment.
 */
export async function requestPickup(
  shipmentId: number
): Promise<{ pickup_scheduled_date: string }> {
  const res = await shiprocketFetch("/courier/generate/pickup", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [shipmentId] }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket pickup request failed: ${text}`);
  }

  return res.json();
}

/**
 * Track a shipment by AWB code.
 */
export async function trackShipment(
  awbCode: string
): Promise<{
  tracking_data: {
    track_status: number;
    shipment_status: number;
    shipment_track: Array<{
      current_status: string;
      delivered_date: string;
      edd: string;
    }>;
    shipment_track_activities: Array<{
      date: string;
      activity: string;
      location: string;
    }>;
  };
}> {
  const res = await shiprocketFetch(
    `/courier/track/awb/${encodeURIComponent(awbCode)}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket tracking failed: ${text}`);
  }

  return res.json();
}

/**
 * Get available couriers for a shipment (for rate comparison).
 */
export async function getAvailableCouriers(params: {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number; // kg
  cod: boolean;
}): Promise<
  Array<{
    courier_company_id: number;
    courier_name: string;
    rate: number;
    etd: string; // estimated transit days
  }>
> {
  const qs = new URLSearchParams({
    pickup_postcode: params.pickup_postcode,
    delivery_postcode: params.delivery_postcode,
    weight: params.weight.toString(),
    cod: params.cod ? "1" : "0",
  });

  const res = await shiprocketFetch(
    `/courier/serviceability/?${qs.toString()}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket courier check failed: ${text}`);
  }

  const data = await res.json();
  return (
    data.data?.available_courier_companies?.map(
      (c: {
        courier_company_id: number;
        courier_name: string;
        rate: number;
        etd: string;
      }) => ({
        courier_company_id: c.courier_company_id,
        courier_name: c.courier_name,
        rate: c.rate,
        etd: c.etd,
      })
    ) || []
  );
}
