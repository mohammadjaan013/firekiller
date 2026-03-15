import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary">
            About <span className="text-primary">OustFire</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            21 years of protecting homes, businesses, and lives across India
            with innovative fire safety solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Our Mission
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4">
              Making Fire Safety Accessible to Every Indian Home
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              OustFire Safety Engineers Pvt. Ltd. has been at the forefront of
              fire safety innovation in India for over two decades. We believe
              every home, kitchen, and vehicle deserves reliable fire
              protection that&apos;s affordable, easy to use, and always ready.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our flagship products - FireKiller compact extinguisher and
              PanSafe kitchen sachet - are designed for ordinary people, not
              just firefighters. No training, no maintenance, no excuses.
            </p>
          </div>
          <div className="relative h-72 lg:h-80 bg-muted rounded-2xl overflow-hidden border border-border">
            <Image
              src="/images/brand/oustfire-light.png"
              alt="OustFire"
              fill
              className="object-contain p-12"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Shield,
              title: "Safety First",
              desc: "Every product is ISI certified and BIS approved for your peace of mind.",
            },
            {
              icon: Award,
              title: "21 Years Experience",
              desc: "Two decades of fire safety expertise powering every product we make.",
            },
            {
              icon: Users,
              title: "4,200+ Happy Clients",
              desc: "Trusted by thousands of families and businesses across India.",
            },
            {
              icon: Target,
              title: "42,400 Products Sold",
              desc: "Proven track record of protecting lives with reliable fire safety.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-secondary text-sm mb-1">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-secondary mb-3">
            Want to Partner With Us?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We work with distributors, architects, builders, and government
            agencies across India. Get in touch to explore opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/vendor-enquiry"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Vendor Enquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
