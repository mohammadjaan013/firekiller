"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";


const footerLinks = {
  Products: [
    { label: "Home Extinguishers", href: "/shop?category=home" },
    { label: "Kitchen Safety", href: "/shop?category=kitchen" },
    { label: "Car Extinguishers", href: "/shop?category=car" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    // { label: "Vendor Enquiry", href: "/vendor-enquiry" },
    // { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
  ],
  Support: [
    // { label: "FAQs", href: "/faqs" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-3">
              <Image
                src="/images/brand/oustfire-light.png"
                alt="FireKiller"
                width={160}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </Link>
            {/* <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-sm">
              India&apos;s most trusted compact fire extinguisher brand.
              Protecting homes, kitchens, and cars with innovative fire safety
              solutions since 2020.
            </p> */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+919324259477" className="hover:text-primary transition-colors">+91 93242 59477</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:sales@oustfire.com" className="hover:text-primary transition-colors">sales@oustfire.com</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Laxmiwadi, Patil House, 394, Thane - Belapur Rd, near SI Group, MIDC Industrial Area, Juinagar, Navi Mumbai, Maharashtra 400705</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FireKiller. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Facebook, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Youtube, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
