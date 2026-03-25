import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  Users,
  ArrowRight,
  Flame,
  Quote,
  CheckCircle2,
  Handshake,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative bg-secondary overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
        {/* decorative blobs */}
        <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-100 h-100 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            About OustFire
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Making Fire Safety{" "}
            <span className="text-primary">Accessible</span> to Every Indian Home
          </h1>
          <p className="mt-5 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            21+ years. 42,400+ products sold. 4,200+ clients. ISI certified.
            Not numbers we chase — proof that the idea works.
          </p>

          {/* stat pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { value: "21+", label: "Years" },
              { value: "42,400+", label: "Products Sold" },
              { value: "4,200+", label: "Clients" },
              { value: "ISI", label: "Certified" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 text-center min-w-27.5"
              >
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 1: The Mind Behind the Mission ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-linear-to-br from-secondary via-secondary to-secondary/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Photo */}
            <div className="lg:col-span-2 relative min-h-72 lg:min-h-110">
              <Image
                src="/images/brand/CEO.jpeg"
                alt="Mr. Babulal Shaikh - Founder & Visionary, OustFire"
                fill
                className="object-cover"
                priority
              />
              {/* gradient overlay at bottom on mobile */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-secondary to-transparent lg:hidden" />
            </div>

            {/* Content */}
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  The Mind Behind the Mission
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Mr. Babulal Shaikh
              </h2>
              <p className="text-sm text-white/50 mb-4">
                Founder &amp; Visionary, OustFire Safety Engineers Pvt. Ltd.
              </p>

              <div className="space-y-4 text-white/80 leading-relaxed text-[15px]">
                <p>
                  Mr. Babulal Shaikh spent years inside the fire safety industry
                  — and the more he understood it, the more one thing became
                  clear: the entire market was built for industries, not people.
                </p>
                <p>
                  Bulky cylinders. Technical operation. High prices. Products
                  designed for trained professionals in factories and offices —
                  not for a family in a kitchen or a commuter in a car.
                </p>
                <p>
                  He saw the gap. He decided to close it.
                </p>
                <p>
                  With two decades of domain expertise and a stubborn belief that
                  every Indian home deserves real fire protection, he built
                  OustFire from the ground up. The{" "}
                  <strong className="text-primary">PanSafe</strong> and{" "}
                  <strong className="text-primary">FireKiller</strong>{" "}
                  weren&apos;t just new products. They were a different category
                  entirely — consumer-grade fire safety that actually works for
                  the common man.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-5 flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                <Quote className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <p className="text-white font-medium italic text-[15px] leading-relaxed">
                  &ldquo;Fire doesn&apos;t wait. Neither should safety.&rdquo;
                </p>
              </div>

              {/* Mini stats */}
              {/* <div className="mt-5 flex flex-wrap gap-3">
                {[
                  { value: "21+", label: "Years in Fire Safety" },
                  { value: "2", label: "Patented Products" },
                  { value: "1000s", label: "Lives Protected" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/10 rounded-xl px-5 py-3 text-center"
                  >
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-[10px] text-white/50">{s.label}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Our Story ── */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
              Built for the India That Was Being Ignored
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
              <p>
                When OustFire launched, the fire safety market in India had a
                serious blind spot. Industrial extinguishers dominated the space
                — heavy, technical, and priced out of reach for most households.
                The average Indian family had{" "}
                <strong className="text-secondary">nothing</strong>.
              </p>
              <p>
                We saw that gap and we filled it.
              </p>
              <p>
                OustFire was built on a straightforward conviction: fire safety
                should be as common as a first-aid kit. Not a corporate
                purchase. Not a compliance checkbox. Something every home, every
                kitchen, every car should have — and actually use when it
                matters.
              </p>
              <p>
                Our engineers didn&apos;t just shrink an extinguisher. They
                rethought the product entirely — what triggers panic in a fire,
                why people freeze, what makes someone actually reach for
                protection in 3 seconds. Every design decision came from that
                thinking.
              </p>
              <p className="font-semibold text-secondary">
                The result: products that need no manual, no training, no
                maintenance. Just instant protection.
              </p>
            </div>

            {/* Visual card */}
            <div className="space-y-4">
              <div className="relative h-56 bg-white rounded-3xl overflow-hidden border border-border shadow-sm">
                <Image
                  src="/images/brand/man2.png"
                  alt="OustFire Products"
                  fill
                  className="object-contain p-8"
                />
              </div>
              {/* <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "21+", label: "Years" },
                  { value: "42.4K", label: "Sold" },
                  { value: "4.2K+", label: "Clients" },
                  { value: "ISI", label: "Certified" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl py-3 text-center border border-border shadow-sm"
                  >
                    <p className="text-xl font-bold text-primary">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: What We Offer ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            What We Offer
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
            Products Designed for Every Indian Home
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FireKiller Card */}
          <div className="group relative bg-white rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-44 bg-muted/50">
              <Image
                src="/images/products/firekiller-1.webp"
                alt="FireKiller"
                fill
                className="object-contain p-6"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-secondary">FireKiller</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                India&apos;s most compact fire extinguisher. Designed for homes,
                cars, and offices. Small enough to keep anywhere, effective
                enough to matter.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Homes", "Cars", "Offices", "ISI Certified"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PanSafe Card */}
          <div className="group relative bg-white rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-44 bg-muted/50">
              <Image
                src="/images/products/pansafe-1.webp"
                alt="PanSafe"
                fill
                className="object-contain p-6"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-secondary">PanSafe</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                OustFire&apos;s patented kitchen fire sachet. No aiming, no
                training — just throw it on the flame. Instant kitchen
                protection.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Patented", "No Training", "BIS Approved", "ISI Certified"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Certification banner */}
        <div className="mt-8 bg-secondary/5 rounded-2xl border border-secondary/10 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-secondary">
              Both products are ISI certified and BIS approved.
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Not as a formality — because we won&apos;t put something in an
              Indian home that we haven&apos;t put through the full standard.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Trust Metrics ── */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Award, value: "21+", label: "Years Experience" },
              {
                icon: Users,
                value: "4,200+",
                label: "Happy Clients",
              },
              { icon: Shield, value: "42,400+", label: "Products Sold" },
              {
                icon: Flame,
                value: "ISI",
                label: "Certified & BIS Approved",
              },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="w-12 h-12 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {value}
                </p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA — Want to Work With Us? ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative bg-linear-to-br from-primary to-primary-dark rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
          {/* decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative">
            <div className="w-12 h-12 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Handshake className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Want to Work With Us?
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-6 text-sm leading-relaxed">
              We partner with distributors, architects, builders, and government
              agencies across India. If you&apos;re serious about fire safety
              reaching more people, so are we.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-bold rounded-full hover:bg-white/90 transition-colors shadow-lg"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/vendor-enquiry"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition-colors"
              >
                Vendor Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
