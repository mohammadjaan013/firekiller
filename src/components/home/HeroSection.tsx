"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-white via-red-50/30 to-orange-50/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-orange-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-secondary leading-[1.1]">
              Protect Your Home{" "}
              <span className="text-primary">in Seconds.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Compact, powerful fire extinguishers designed for modern homes.
              Easy to use, no maintenance, and works on multiple fire classes.
            </p>

            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { icon: Shield, label: "No Maintenance" },
                { icon: Zap, label: "Easy to Use" },
                { icon: Layers, label: "Multi-Class Protection" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border text-sm font-medium text-secondary"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-secondary font-semibold rounded-full border border-border hover:border-primary hover:text-primary transition-all"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Product Image Placeholder */}
            <div className="relative">
              <div className="w-80 h-96 lg:w-96 lg:h-[480px] bg-gradient-to-b from-red-50 to-orange-50 rounded-3xl flex items-center justify-center shadow-2xl border border-red-100/50">
                <div className="text-center p-8">
                  <div className="w-32 h-48 mx-auto bg-gradient-to-b from-red-600 to-red-700 rounded-lg shadow-lg relative">
                    {/* Fire extinguisher shape */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-6 bg-gray-800 rounded-t-lg" />
                    <div className="absolute -top-6 right-2 w-6 h-8 bg-red-500 rounded-r-lg transform rotate-12" />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-24 bg-white/90 rounded-sm flex items-center justify-center">
                      <span className="text-red-700 font-bold text-[10px] text-center leading-tight">
                        FIRE<br/>KILLER
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Replace with your product image
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 lg:top-8 lg:-right-8 bg-white rounded-2xl shadow-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground text-center">Works on</p>
                <p className="text-sm font-bold text-secondary text-center">
                  Oil, Gas &
                </p>
                <p className="text-sm font-bold text-primary text-center">
                  Electrical Fires!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
