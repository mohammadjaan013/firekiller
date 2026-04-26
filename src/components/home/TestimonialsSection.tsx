"use client";

import { useRef, useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Courtyard by Marriott",
    location: "Navi Mumbai",
    rating: 5,
    text: "Very innovative, easy to use and cost efficient product. Highly recommended for every kitchen.",
    logo: "/images/clients/client-2.png",
  },
  {
    name: "Embassy Services Pvt Ltd.",
    location: "Bengaluru",
    rating: 5,
    text: "Pansafe Kitchen Pouch - Best and easy to use. Every commercial kitchen needs this.",
    logo: "/images/clients/client-3.png",
  },
  {
    name: "Apna Security System",
    // location: "Google Review · ⭐⭐⭐⭐⭐",
    rating: 5,
    text: "Pansafe kitchen sachet is a smart addition for every modern kitchen. Really a very good product - every kitchen must have.",
    logo: "/images/clients/clients-4.jpg",
  },
  {
    name: "Raymond",
    location: "Corporate Client",
    rating: 5,
    text: "It should be part of the fire safety kit issued to corporates. Make it available on e-commerce platforms - this is a must-have.",
    logo: "/images/clients/client-1.png",
  },
];

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -320 : 320;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
              What Our <span className="text-primary">Clients</span> Say
            </h2>
            <p className="mt-2 text-muted-foreground">
              Trusted by thousands of families across India
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5 text-secondary" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5 text-secondary" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="min-w-[300px] max-w-[320px] bg-muted rounded-2xl p-6 border border-border relative shrink-0 snap-start"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-sm text-secondary leading-relaxed mb-6 line-clamp-4">
                &quot;{t.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-border flex items-center justify-center shrink-0">
                  <Image
                    src={t.logo}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
