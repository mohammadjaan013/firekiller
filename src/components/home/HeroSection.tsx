"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Truck, ShieldCheck, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "No Maintenance Required",
  "Easy to Use - Anyone Can Operate",
];

const trustMicro = [
  // { icon: Truck, label: "COD Available" },
  { icon: ShieldCheck, label: "Fast Shipping" },
  { icon: Award, label: "Tested & Trusted" },
];

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                #1 Home Fire Safety Device
              </span>
            </div> */}

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-secondary">
              Protect Your Home
              <br />
              <span className="text-primary">in Seconds</span>
            </h1>

            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Compact. Powerful. Easy to Use.
            </p>

            {/* Feature List */}
            <ul className="mt-6 space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-secondary">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop/firekiller-1"
                className="inline-flex items-center px-7 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-md"
              >
                Buy FireKiller
              </Link>
              <Link
                href="/shop/pansafe-1"
                className="inline-flex items-center px-7 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Kitchen Protection
              </Link>
            </div>

            {/* Trust Micro Badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              {trustMicro.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-green-600" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side — Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center lg:-mr-8 xl:-mr-16"
          >
            <div className="relative lg:scale-110 xl:scale-125 origin-center">
              <Image
                src="/images/hero/hero-new-2.png"
                alt="FireKiller Extinguisher"
                width={900}
                height={750}
                className="w-full object-contain"
                style={{ mask: 'linear-gradient(to top, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', maskComposite: 'intersect', WebkitMask: 'linear-gradient(to top, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskComposite: 'source-in' }}
                priority
              />
            </div>


          </motion.div>
        </div>
      </div>
    </section>
  );
}
