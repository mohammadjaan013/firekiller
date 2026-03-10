"use client";

import { Truck, ShieldCheck, Headphones, Award } from "lucide-react";

const features = [
  { icon: Truck, title: "Fast Shipping", subtitle: "All India Delivery" },
  { icon: ShieldCheck, title: "Secure Checkout", subtitle: "100% Safe" },
  { icon: Headphones, title: "Customer Support", subtitle: "24/7 WhatsApp" },
  { icon: Award, title: "1 Year Warranty", subtitle: "Guaranteed" },
];

export default function TrustBar() {
  return (
    <section className="bg-[#8B1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/70">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
