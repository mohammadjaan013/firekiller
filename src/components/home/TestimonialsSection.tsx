"use client";

import { useRef, useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "New Delhi",
    rating: 5,
    text: "FireKiller saved my kitchen when an oil fire broke out. It was so easy to use - just point and press. Every home in India needs one!",
    avatar: "RK",
  },
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "I bought the car compact version and feel so much safer on long drives. The quality is amazing and the size is perfect for my dashboard.",
    avatar: "PS",
  },
  {
    name: "Amit Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "The PanSafe sachet is genius. I keep one near my stove and one in my car. Best investment for family safety. Highly recommended!",
    avatar: "AP",
  },
  {
    name: "Sneha Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "Gifted FireKiller to my parents. They are elderly and this gives me peace of mind. The one-hand operation is perfect for them.",
    avatar: "SR",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 5,
    text: "We installed 3 FireKillers across our office. The wall mount bracket makes it super accessible. Great product by OustFire!",
    avatar: "VS",
  },
  {
    name: "Meera Nair",
    location: "Kochi",
    rating: 5,
    text: "PanSafe is a must-have for every Indian kitchen. We cook with oil daily and this gives instant protection. Just throw and forget!",
    avatar: "MN",
  },
  {
    name: "Arjun Mehta",
    location: "Pune",
    rating: 5,
    text: "Compact, affordable, and ISI certified. What more can you ask? I have one in every room now. Thanks OustFire!",
    avatar: "AM",
  },
  {
    name: "Kavita Joshi",
    location: "Bengaluru",
    rating: 5,
    text: "After a small fire incident at home, I ordered the 3-unit pack immediately. Now I feel safe. The delivery was quick too!",
    avatar: "KJ",
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
              What Our <span className="text-primary">Customers</span> Say
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
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {t.avatar}
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
