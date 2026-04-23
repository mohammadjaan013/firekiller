import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | OustFire",
  description: "Terms and conditions for using the OustFire website and purchasing our products.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">Terms &amp; Conditions</h1>
          <p className="mt-3 text-muted-foreground">Last updated: March 2025</p>
        </div>

        <div className="prose prose-sm sm:prose max-w-none space-y-8 text-secondary/80">

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">1. Company Details</h2>
            <p>
              This website is operated by <strong>OustFire</strong>, manufacturer of FireKiller and
              PanSafe fire safety products. By accessing or using our website, you agree to be bound
              by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">2. Acceptance of Terms</h2>
            <p>
              By using this website — whether to browse, create an account, or place an order — you
              accept these Terms &amp; Conditions in full. If you disagree with any part of these
              terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">3. Product Information</h2>
            <p>
              We make every effort to ensure product descriptions, images, and specifications are
              accurate. However, we do not warrant that descriptions are error-free. OustFire
              reserves the right to correct any inaccuracies and to update product information
              at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">4. Pricing</h2>
            <p>
              All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless
              stated otherwise. We reserve the right to change prices at any time without prior notice.
              The price charged at the time of placing your order will apply.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">5. Shipping &amp; Delivery</h2>
            <p>
              Delivery timelines and shipping terms are governed by our{" "}
              <Link href="/shipping-policy" className="text-primary hover:underline">
                Shipping Policy
              </Link>
              . OustFire is not responsible for delays caused by third-party logistics partners or
              circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">6. Cancellations &amp; Returns</h2>
            <p>
              Cancellations, returns, and refunds are governed by our{" "}
              <Link href="/return-policy" className="text-primary hover:underline">
                Refund &amp; Cancellation Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">7. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, videos, and design — is
              the exclusive property of OustFire and is protected by copyright law. You may not
              reproduce, distribute, or use any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">8. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, OustFire shall not be liable for any indirect,
              incidental, or consequential damages arising from the use of our products or website.
              Our total liability shall not exceed the amount paid for the relevant order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">9. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">10. Contact Us</h2>
            <p>
              For questions about these terms, contact us at{" "}
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
