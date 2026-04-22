import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy | OustFire",
  description: "Refund and cancellation policy for OustFire — FireKiller and PanSafe products.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">Refund &amp; Cancellation Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: March 2025</p>
        </div>

        <div className="prose prose-sm sm:prose max-w-none space-y-8 text-secondary/80">

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">1. Order Cancellation</h2>
            <p>
              Orders can be cancelled within <strong>24 hours</strong> of placement, provided they
              have not yet been dispatched. To cancel, please contact us immediately at{" "}
              <a href="mailto:oustfire@gmail.com" className="text-primary hover:underline">
                oustfire@gmail.com
              </a>{" "}
              with your order ID.
            </p>
            <p className="mt-2">
              Once an order is dispatched, cancellation is not possible. In such cases, you may
              initiate a return after delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">2. Return &amp; Replacement</h2>
            <p>We accept returns or replacements in the following cases:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The product received is <strong>damaged or defective</strong></li>
              <li>The <strong>wrong product</strong> was delivered</li>
              <li>The product is <strong>missing components</strong> as described</li>
            </ul>
            <p className="mt-2">
              Returns must be requested within <strong>7 days</strong> of delivery. Products must
              be unused and in their original packaging. Please share photos of the issue when
              raising a return request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">3. Refund Process</h2>
            <p>
              Once your return is approved and the product is received by us, refunds will be
              processed within <strong>5–7 business days</strong> to your original payment method.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Credit/Debit Cards: 5–7 business days</li>
              <li>UPI / Net Banking: 3–5 business days</li>
              <li>Prepaid orders via Razorpay: Refunded to source account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">4. Non-Returnable Items</h2>
            <p>
              The following items are <strong>not eligible</strong> for return or refund:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Products that have been used or activated</li>
              <li>Items returned after the 7-day window</li>
              <li>Products damaged due to misuse or improper handling</li>
              <li>Orders where free gifts or promotional items were included (gifts are non-returnable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">5. Contact Us</h2>
            <p>
              To initiate a return, cancellation, or refund request, contact us at{" "}
              <a href="mailto:oustfire@gmail.com" className="text-primary hover:underline">
                oustfire@gmail.com
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              . Please include your order ID and a description of the issue.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
