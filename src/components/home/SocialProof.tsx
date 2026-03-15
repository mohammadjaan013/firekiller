"use client";

import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck, Users } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "New Delhi",
    rating: 5,
    text: "FireKiller saved my kitchen when an oil fire broke out. It was so easy to use - just point and press. Every home in India needs one!",
    avatar: "RK",
    verified: true,
  },
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "I bought one for my car and feel so much safer on long drives. The quality is amazing and the size is perfect for my dashboard.",
    avatar: "PS",
    verified: true,
  },
  {
    name: "Amit Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "The PanSafe sachet is genius. I keep one near my stove. Best investment for family safety. Highly recommended!",
    avatar: "AP",
    verified: true,
  },
];

export default function SocialProof() {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Hear from families who made fire safety a priority
          </p>

          {/* Trust Counter */}
          <div className="mt-8 inline-flex items-center gap-6 px-6 py-3 rounded-full bg-card border border-border">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">12,400+ homes protected</span>
            </div>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-semibold ml-1">4.8/5</span>
            </div>
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-all relative group"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/10 group-hover:text-primary/15 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-foreground/80 mb-6">
                &quot;{t.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{t.name}</p>
                    {t.verified && (
                      <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    )}
                  </div>
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
