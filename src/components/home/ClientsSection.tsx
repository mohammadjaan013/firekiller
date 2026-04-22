"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const clients = [
  {
    name: "Courtyard by Marriott",
    sub: "Navi Mumbai",
    image: "/images/clients/client-2.png",
    quote: "Very innovative, easy to use and cost efficient product. Highly recommended for every kitchen.",
  },
  {
    name: "Embassy Services Pvt Ltd.",
    sub: "Bengaluru",
    image: "/images/clients/client-3.png",
    quote: "Pansafe Kitchen Pouch — Best and easy to use. Every commercial kitchen needs this.",
  },
  {
    name: "Apna Security System",
    sub: "Google Review · ⭐⭐⭐⭐⭐",
    image: "/images/clients/clients-4.jpg",
    quote: "Pansafe kitchen sachet is a smart addition for every modern kitchen. Really a very good product — every kitchen must have.",
  },
  {
    name: "Raymond",
    sub: "",
    image: "/images/clients/client-1.png",
    quote: "It should be part of the fire safety kit issued to corporates. Make it available on e-commerce platforms — this is a must-have.",
  },
];

export default function ClientsSection() {
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

  // Auto-scroll every 3.5s
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-muted/30 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Trusted By</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary">
              What Our Clients Say
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4 text-secondary" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4 text-secondary" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 min-w-70 max-w-75 shrink-0 snap-start"
            >
              <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-border bg-white">
                <Image
                  src={client.image}
                  alt={client.name}
                  fill
                  className="object-contain p-1"
                  sizes="44px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-secondary leading-tight">{client.name}</p>
                {client.sub && (
                  <p className="text-xs text-muted-foreground mb-1.5">{client.sub}</p>
                )}
                <p className="text-xs text-secondary/70 leading-relaxed">&ldquo;{client.quote}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
