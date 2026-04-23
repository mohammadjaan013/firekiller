import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | OustFire",
  description: "Shipping policy for OustFire products including FireKiller and PanSafe.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">Shipping Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: March 2025</p>
        </div>

        <div className="prose prose-sm sm:prose max-w-none space-y-8 text-secondary/80">

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">1. Shipping Coverage</h2>
            <p>
              We currently ship across India. International shipping is not available at this time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">2. Shipping Charges</h2>
            <p>
              We offer free shipping on all orders across India. There are no additional delivery charges
              applied at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">3. Order Processing Time</h2>
            <p>
              Orders are processed within <strong>1–2 business days</strong> after payment confirmation.
              Orders placed on weekends or public holidays will be processed on the next working day.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">4. Estimated Delivery Time</h2>
            <p>
              Delivery typically takes <strong>4–7 business days</strong> depending on your location.
              Metro cities may receive orders faster (3–5 days), while remote areas may take up to
              10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">5. Order Tracking</h2>
            <p>
              Once your order is dispatched, you will receive a tracking number via email and/or SMS.
              You can use this number to track your shipment on the carrier&apos;s website. You can also
              view order status in your <Link href="/orders" className="text-primary hover:underline">account orders page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">6. Delays</h2>
            <p>
              While we strive to ensure timely delivery, delays may occasionally occur due to factors
              beyond our control such as weather conditions, carrier issues, or public holidays. We
              appreciate your patience in such cases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">7. Damaged or Lost Shipments</h2>
            <p>
              If your order arrives damaged or is lost in transit, please contact us within
              <strong> 48 hours</strong> of the expected delivery date with your order ID and photos
              (if applicable). We will arrange a replacement or refund promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">8. Contact Us</h2>
            <p>
              For any shipping-related queries, reach us at{" "}
              <a href="mailto:sales@oustfire.com" className="text-primary hover:underline">
                sales@oustfire.com
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
