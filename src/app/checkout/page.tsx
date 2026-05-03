/// <reference types="@types/google.maps" />
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Shield,
  Loader2,
  Truck,
  Search,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

/* ── Razorpay global type ─────────────────────────────── */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/* ── Indian states ────────────────────────────────────── */
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli",
  "Daman & Diu", "Lakshadweep", "Puducherry",
];

/* ── Address component parser (used by autocomplete + reverse geocoder) ── */
function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[]
): { areaFilled: string; locality: string; adminArea: string; postalCode: string } {
  let streetNumber = "", route = "",
      subloc1 = "", subloc2 = "", subloc3 = "",
      locality = "", adminArea = "", postalCode = "";

  for (const comp of components) {
    const types = comp.types;
    if (types.includes("street_number"))            streetNumber = comp.long_name;
    else if (types.includes("route"))               route        = comp.long_name;
    else if (types.includes("sublocality_level_3")) subloc3      = comp.long_name;
    else if (types.includes("sublocality_level_2")) subloc2      = comp.long_name;
    else if (types.includes("sublocality_level_1") || types.includes("sublocality")) subloc1 = comp.long_name;
    else if (types.includes("locality"))            locality     = comp.long_name;
    else if (types.includes("administrative_area_level_1")) adminArea = comp.long_name;
    else if (types.includes("postal_code"))         postalCode   = comp.long_name;
  }

  const streetInfo = [streetNumber, route].filter(Boolean).join(" ");
  const areaFromSubloc = [subloc3, subloc2, subloc1]
    .filter(Boolean)
    .filter((p) => p.toLowerCase() !== locality.toLowerCase());
  const areaFilled = [streetInfo, ...areaFromSubloc].filter(Boolean).join(", ");

  return { areaFilled, locality, adminArea, postalCode };
}

/* ── Page ─────────────────────────────────────────────── */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, appliedCoupon, clearCart } = useCart();
  const { showToast } = useToast();
  const { data: session } = useSession();

  const [shipping, setShipping] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingFetched, setShippingFetched] = useState(false);
  const gstAmount = Math.round(subtotal * 0.18);
  const total = subtotal + gstAmount + shipping - discount;

  // Google Maps Places autocomplete + interactive map
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const line1InputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Address form
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"address" | "payment">("address");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Pre-fill from session (name/email) and last order address
  useEffect(() => {
    // Start with session user data
    if (session?.user) {
      setAddress((prev) => ({
        ...prev,
        name: prev.name || session.user.name || "",
        email: prev.email || session.user.email || "",
      }));
    }

    // Fetch last order address for returning customers
    if (session?.user?.id) {
      fetch("/api/account/last-address")
        .then((res) => res.json())
        .then((data) => {
          const u = data.user;
          const addr = data.address;
          setAddress((prev) => ({
            name: prev.name || u?.name || "",
            phone: prev.phone || u?.phone || addr?.phone || "",
            email: prev.email || u?.email || "",
            line1: prev.line1 || addr?.line1 || "",
            line2: prev.line2 || addr?.line2 || "",
            city: prev.city || addr?.city || "",
            state: prev.state || addr?.state || "",
            pincode: prev.pincode || addr?.pincode || "",
          }));
        })
        .catch(() => {});
    }
  }, [session]);

  // Fetch Shiprocket shipping rate when pincode is complete
  const fetchShippingRate = useCallback(async (pincode: string) => {
    if (pincode.length !== 6) return;
    setShippingLoading(true);
    try {
      const res = await fetch(`/api/shiprocket/rates?pincode=${pincode}`);
      if (res.ok) {
        const data = await res.json();
        setShipping(data.rate ?? 0);
        setShippingFetched(true);
      }
    } catch {
      // silently fall back to free shipping
    } finally {
      setShippingLoading(false);
    }
  }, []);

  // Init (or re-init) Google Maps autocomplete each time the address step is visible.
  useEffect(() => {
    if (!mapsLoaded || step !== "address" || !autocompleteInputRef.current) return;

    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    // No `types` restriction — allows buildings, complexes, areas, pincodes
    const ac = new google.maps.places.Autocomplete(autocompleteInputRef.current, {
      componentRestrictions: { country: "in" },
      fields: ["address_components", "formatted_address", "geometry"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.address_components) return;

      const { areaFilled, locality, adminArea, postalCode } =
        parseAddressComponents(place.address_components);

      // Always overwrite auto-filled fields — clears stale data from previous search
      setAddress((prev) => ({
        ...prev,
        // line1 intentionally untouched — user fills flat/apartment/floor
        line2: areaFilled,
        city: locality,
        state: STATES.includes(adminArea) ? adminArea : "",
        pincode: postalCode,
      }));

      if (postalCode && postalCode.length === 6) {
        fetchShippingRate(postalCode);
      }

      // Show interactive map so user can drag pin to their exact building/gate
      const loc = place.geometry?.location;
      if (loc) {
        setMapCenter({ lat: loc.lat(), lng: loc.lng() });
        setShowMap(true);
      }

      // Focus flat/apartment field so user can immediately type their unit number
      setTimeout(() => line1InputRef.current?.focus(), 50);
    });

    autocompleteRef.current = ac;
  }, [mapsLoaded, step, fetchShippingRate]);

  // Initialize (or re-initialize) the interactive map when center or step changes.
  // step is in deps so the map re-mounts correctly after the user clicks Edit.
  useEffect(() => {
    if (!mapsLoaded || !showMap || !mapCenter || !mapContainerRef.current) return;

    // Always create a fresh instance (stale instance after step change)
    mapInstanceRef.current = new google.maps.Map(mapContainerRef.current, {
      zoom: 17,
      center: mapCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });

    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    if (markerRef.current) markerRef.current.setMap(null);

    markerRef.current = new google.maps.Marker({
      position: mapCenter,
      map: mapInstanceRef.current,
      draggable: true,
      title: "Drag to your exact building / gate",
    });

    markerRef.current.addListener("dragend", () => {
      const pos = markerRef.current?.getPosition();
      if (!pos || !geocoderRef.current) return;

      geocoderRef.current.geocode(
        { location: { lat: pos.lat(), lng: pos.lng() } },
        (results, status) => {
          if (status !== "OK" || !results?.[0]) return;
          const { areaFilled, locality, adminArea, postalCode } =
            parseAddressComponents(results[0].address_components);

          setAddress((prev) => ({
            ...prev,
            line2: areaFilled || prev.line2,
            city: locality || prev.city,
            state: STATES.includes(adminArea) ? adminArea : prev.state,
            pincode: postalCode || prev.pincode,
          }));

          if (postalCode && postalCode.length === 6) {
            fetchShippingRate(postalCode);
          }
        }
      );
    });
  }, [mapsLoaded, showMap, mapCenter, step, fetchShippingRate]);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Nothing to checkout
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart first.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (field === "pincode" && value.length === 6) {
      fetchShippingRate(value);
    }
  };

  const isAddressValid =
    address.name.trim() &&
    address.phone.trim().length >= 10 &&
    address.email.includes("@") &&
    address.line1.trim() &&
    address.city.trim() &&
    address.state &&
    address.pincode.trim().length === 6;

  /* ── Razorpay payment ──────────────────────────────── */
  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      showToast("Payment system loading, please wait…");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order on our server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          receipt: `fk_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create payment order");
      const { orderId, amount, currency } = await orderRes.json();

      // 2. Open Razorpay checkout modal
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency,
        name: "FireKiller",
        description: `Order - ${items.length} item${items.length > 1 ? "s" : ""}`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // 3. Verify payment signature
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            // 4. Place order in our system
            const placeRes = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                address,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                items: items.map((i) => ({
                  productId: i.id,
                  slug: i.slug,
                  name: i.name,
                  quantity: i.quantity,
                  price: i.price,
                })),
                subtotal,
                shipping,
                total,
              }),
            });

            if (!placeRes.ok) throw new Error("Failed to place order");
            const { orderNumber } = await placeRes.json();

            // 5. Clear cart and redirect to confirmation
            clearCart();
            router.push(`/order-confirmation?order=${orderNumber}`);
          } catch {
            showToast("Payment received but order placement failed. Contact support.");
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#CC1F1F" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      showToast("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setMapsLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link
              href="/cart"
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-secondary" />
            </Link>
            <h1 className="text-2xl font-bold text-secondary">Checkout</h1>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setStep("address")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                step === "address"
                  ? "bg-primary text-white"
                  : "bg-card text-secondary border border-border"
              }`}
            >
              <MapPin className="h-4 w-4" />
              1. Delivery Address
            </button>
            <div className="w-8 h-px bg-border" />
            <button
              disabled={!isAddressValid}
              onClick={() => setStep("payment")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                step === "payment"
                  ? "bg-primary text-white"
                  : "bg-card text-secondary border border-border"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <CreditCard className="h-4 w-4" />
              2. Payment
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-3">
              {step === "address" && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>

                    {/* Google Maps search */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Search Your Building / Area / Street
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                          ref={autocompleteInputRef}
                          type="text"
                          placeholder="Type your building name, society, street or pincode…"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select from dropdown → a map appears → drag the pin to your exact gate
                      </p>
                    </div>

                    {/* Interactive map — shows after autocomplete selection */}
                    {showMap && (
                      <div className="sm:col-span-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold text-primary">
                            Drag the pin to your exact building / gate
                          </span>
                        </div>
                        <div
                          ref={mapContainerRef}
                          className="w-full h-52 rounded-xl border border-border overflow-hidden"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Moving the pin auto-updates the area &amp; pincode fields below
                        </p>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Street / Area / Landmark
                        {address.line2 && (
                          <span className="ml-2 text-green-600 font-normal">✓ auto-filled</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={address.line2}
                        onChange={(e) => updateField("line2", e.target.value)}
                        placeholder="Auto-filled from search above (editable)"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Flat / Apartment / Floor *
                      </label>
                      <input
                        ref={line1InputRef}
                        type="text"
                        value={address.line1}
                        onChange={(e) => updateField("line1", e.target.value)}
                        placeholder="e.g. Flat 4B, 2nd Floor, Tower C"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="Mumbai"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        State *
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      >
                        <option value="">Select State</option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="400001"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("payment")}
                    disabled={!isAddressValid}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                    <CreditCard className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment
                  </h2>

                  {/* Delivery Summary */}
                  <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-secondary">
                          {address.name}
                        </p>
                        {address.line1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {address.line1}
                          </p>
                        )}
                        {address.line2 && (
                          <p className="text-xs text-muted-foreground">
                            {address.line2}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {address.city}, {address.state} – {address.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {address.phone} · {address.email}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep("address")}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Razorpay info */}
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Click below to complete payment via Razorpay. You can pay
                      using UPI, credit/debit cards, net banking, or wallets.
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>
                        100% secure payment. Your data is encrypted and safe.
                      </span>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-60 text-base shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          Pay ₹{total.toLocaleString()}
                          <CreditCard className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
                <h3 className="text-base font-bold text-secondary mb-4">
                  Order Summary
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-secondary truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-secondary whitespace-nowrap">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-border mb-4" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-secondary">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium text-secondary">
                      ₹{gstAmount.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({appliedCoupon})</span>
                      <span className="font-medium">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" /> Shipping
                    </span>
                    <span className="font-medium text-secondary">
                      {shippingLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin inline" />
                      ) : shipping === 0 ? (
                        <span className="text-green-600">{shippingFetched ? "FREE" : "Calculated at next step"}</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-base pt-1">
                    <span className="font-bold text-secondary">Total</span>
                    <span className="font-bold text-secondary">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    Secure checkout powered by Razorpay
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                    Fast delivery to your doorstep
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
