// ─── Server-side order pricing ──────────────────────────
// The ONLY place the amount a customer is charged gets computed.
// Never trust prices/totals sent by the browser: it only tells us WHAT
// it wants (slug + quantity, coupon code, pincode); we work out HOW MUCH.
//
// Prices come from src/lib/products.ts - the same catalogue the storefront
// renders - so what the customer sees is exactly what they are charged.

import { prisma } from "@/lib/db";
import { getAvailableCouriers } from "@/lib/shiprocket";
import { getProductBySlug } from "@/lib/products";

export const GST_RATE = 0.18;
const MAX_QTY_PER_LINE = 50;

const PICKUP_PINCODE = "400705"; // Juinagar, Navi Mumbai
const PACKAGE_WEIGHT = 0.5; // kg - average for 1 FireKiller unit

export interface PricedLine {
  slug: string;
  name: string;
  quantity: number;
  price: number; // unit base price, excl. GST
}

export interface OrderTotals {
  lines: PricedLine[];
  subtotal: number; // excl. GST
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
  couponError: string | null; // set when a requested coupon was rejected
}

export class PricingError extends Error {}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Cheapest Shiprocket rate for a pincode.
 * Falls back to ₹0 (free) if Shiprocket is not configured, the pincode isn't
 * serviceable, or the API fails - checkout must never be blocked by shipping.
 */
export async function getShippingRate(pincode: string): Promise<{
  rate: number;
  courier: string | null;
  etd: string | null;
}> {
  const free = { rate: 0, courier: null, etd: null };
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) return free;

  try {
    const couriers = await getAvailableCouriers({
      pickup_postcode: PICKUP_PINCODE,
      delivery_postcode: pincode,
      weight: PACKAGE_WEIGHT,
      cod: false,
    });
    if (!couriers.length) return free;

    const cheapest = couriers.reduce((a, b) => (a.rate <= b.rate ? a : b));
    return { rate: Math.round(cheapest.rate), courier: cheapest.courier_name, etd: cheapest.etd };
  } catch (err) {
    console.error("Shiprocket rates error:", err);
    return free;
  }
}

/**
 * Validates a coupon against an amount and returns the discount.
 * `amount` is the GST-inclusive subtotal (that is what the cart validates against).
 */
export async function evaluateCoupon(
  code: string,
  amount: number
): Promise<
  | { ok: true; discount: number; coupon: NonNullable<Awaited<ReturnType<typeof prisma.coupon.findUnique>>> }
  | { ok: false; error: string; status: number }
> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon) return { ok: false, error: "Invalid coupon code", status: 404 };
  if (!coupon.isActive) return { ok: false, error: "This coupon is no longer active", status: 400 };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { ok: false, error: "This coupon has expired", status: 400 };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "This coupon has reached its usage limit", status: 400 };
  }
  if (coupon.minOrder && amount && amount < coupon.minOrder) {
    return { ok: false, error: `Minimum order of ₹${coupon.minOrder} required`, status: 400 };
  }

  let discount = 0;
  if (amount) {
    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.discountValue;
    }
  }
  // A discount can never exceed what is being paid for
  discount = Math.min(round2(discount), amount);

  return { ok: true, discount, coupon };
}

/** Prices a cart from scratch. Throws PricingError for malformed/unknown items. */
export async function computeOrderTotals(input: {
  items: unknown;
  couponCode?: unknown;
  pincode?: unknown;
}): Promise<OrderTotals> {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new PricingError("Your cart is empty");
  }

  // Merge duplicate slugs so a line can't be split to dodge the qty cap
  const qtyBySlug = new Map<string, number>();
  for (const raw of input.items) {
    const slug = typeof raw?.slug === "string" ? raw.slug : "";
    const quantity = raw?.quantity;
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new PricingError("Invalid quantity in cart");
    }
    qtyBySlug.set(slug, (qtyBySlug.get(slug) ?? 0) + quantity);
  }

  const lines: PricedLine[] = [];
  for (const [slug, quantity] of qtyBySlug) {
    const product = getProductBySlug(slug);
    if (!product) throw new PricingError("A product in your cart is no longer available");
    if (!product.inStock) throw new PricingError(`"${product.name}" is out of stock`);
    if (quantity > MAX_QTY_PER_LINE) {
      throw new PricingError(`Maximum ${MAX_QTY_PER_LINE} units of "${product.name}" per order`);
    }
    lines.push({ slug, name: product.name, quantity, price: product.price });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const gst = Math.round(subtotal * GST_RATE); // same formula as cart & checkout pages

  const pincode = typeof input.pincode === "string" ? input.pincode : "";
  const shipping = /^\d{6}$/.test(pincode) ? (await getShippingRate(pincode)).rate : 0;

  let discount = 0;
  let couponCode: string | null = null;
  let couponError: string | null = null;
  if (typeof input.couponCode === "string" && input.couponCode.trim()) {
    const result = await evaluateCoupon(input.couponCode.trim(), subtotal + gst);
    if (result.ok) {
      discount = result.discount;
      couponCode = result.coupon.code;
    } else {
      couponError = result.error;
    }
  }

  const total = round2(subtotal + gst + shipping - discount);
  return { lines, subtotal, gst, shipping, discount, total, couponCode, couponError };
}

// ─── Razorpay notes (de)serialisation ───────────────────
// The priced order is stored on the Razorpay order itself (`notes`), so when
// payment succeeds we record exactly what was charged - with no DB row needed
// before payment. Razorpay limits each note value to 256 chars.

const NOTE_MAX = 256;

export function totalsToNotes(t: OrderTotals): Record<string, string> {
  const items = t.lines.map((l) => `${l.slug}:${l.quantity}:${l.price}`).join(",");
  if (items.length > NOTE_MAX) throw new PricingError("Too many different products in one order");
  return {
    items,
    subtotal: String(t.subtotal),
    gst: String(t.gst),
    shipping: String(t.shipping),
    discount: String(t.discount),
    total: String(t.total),
    coupon: t.couponCode ?? "",
  };
}

export function notesToTotals(notes: Record<string, string | number> | undefined) {
  const n = notes ?? {};
  const num = (k: string) => {
    const v = Number(n[k]);
    if (!Number.isFinite(v)) throw new Error(`Razorpay order note "${k}" is missing or invalid`);
    return v;
  };
  const lines: PricedLine[] = String(n.items ?? "")
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const [slug, qty, price] = part.split(":");
      return {
        slug,
        name: getProductBySlug(slug)?.name ?? slug,
        quantity: Number(qty),
        price: Number(price),
      };
    });
  if (lines.length === 0) throw new Error("Razorpay order has no items in its notes");

  return {
    lines,
    subtotal: num("subtotal"),
    gst: num("gst"),
    shipping: num("shipping"),
    discount: num("discount"),
    total: num("total"),
    couponCode: String(n.coupon ?? "") || null,
  };
}
