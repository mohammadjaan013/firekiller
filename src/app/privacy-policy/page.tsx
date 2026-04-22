import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | OustFire",
  description: "Privacy policy for OustFire — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: March 2025</p>
        </div>

        <div className="prose prose-sm sm:prose max-w-none space-y-8 text-secondary/80">

          <p>
            OustFire (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This policy
            describes how we collect, use, and safeguard your personal information when you visit
            our website or purchase our products.
          </p>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal identification</strong>: Name, email address, phone number, and delivery address when you place an order or create an account.</li>
              <li><strong>Payment information</strong>: We do not store card details. Payments are processed securely through Razorpay.</li>
              <li><strong>Device &amp; usage data</strong>: IP address, browser type, pages visited, and time spent on the site — collected automatically via cookies and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and fulfil your orders</li>
              <li>To send order confirmations and shipping updates</li>
              <li>To respond to customer support queries</li>
              <li>To improve our website and product offerings</li>
              <li>To send promotional communications (you may opt out at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">3. Sharing Your Information</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share data
              with trusted service providers (e.g., shipping partners, payment processors) solely
              to fulfil your order. These partners are bound by confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">4. Data Security</h2>
            <p>
              We use industry-standard security measures including SSL encryption to protect your
              personal data. However, no method of transmission over the internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">5. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience, remember your preferences,
              and gather analytics data. You can disable cookies in your browser settings, though some
              features may not function correctly as a result.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">6. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices or content of those sites and encourage you to review their privacy
              policies independently.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. To make such a
              request, contact us at{" "}
              <a href="mailto:oustfire@gmail.com" className="text-primary hover:underline">
                oustfire@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">8. Updates to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this
              page with an updated date. Continued use of the site after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-secondary mb-2">9. Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:oustfire@gmail.com" className="text-primary hover:underline">
                oustfire@gmail.com
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
