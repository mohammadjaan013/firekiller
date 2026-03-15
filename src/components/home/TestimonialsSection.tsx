"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

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
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
            What Our <span className="text-primary">Customers</span> Say
          </h2>
          <p className="mt-3 text-muted-foreground">
            Trusted by thousands of families across India
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-muted rounded-2xl p-6 border border-border relative"
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

              <p className="text-sm text-secondary leading-relaxed mb-6">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
