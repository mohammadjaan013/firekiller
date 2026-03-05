"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const clients = [
  {
    name: "Fire Killer Mini Fire Extinguisher",
    image: "/images/clients/client-1.png",
    quote:
      "It should be part of the fire safety kit facing issued to corporates make it available on E-commerce platforms",
  },
  {
    name: "Pansafe Kitchen Pouch",
    image: "/images/clients/client-2.png",
    quote: "Very innovative easy to use and cost efficient product",
  },
  {
    name: "Embassy Services Pvt Ltd.",
    image: "/images/clients/client-3.png",
    quote: "Pansafe Kitchen Pouch - Best and easy to use",
  },
  {
    name: "Pansafe Kitchen Pouch",
    image: "/images/clients/client-4.jpg",
    quote:
      "Very good product need to do effective marketing so that this product should go in each home",
  },
];

// Double the array for seamless infinite scroll
const allClients = [...clients, ...clients];

export default function ClientsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
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
            What Our <span className="text-primary">Clients</span> Say
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Real feedback from businesses and individuals who trust our products
          </p>
        </motion.div>
      </div>

      {/* Infinite scrolling carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {allClients.map((client, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-5 w-72 shrink-0 group"
            >
              {/* Circular image */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-border bg-card shadow-lg group-hover:border-primary/40 transition-colors duration-300">
                <Image
                  src={client.image}
                  alt={client.name}
                  fill
                  className="object-contain p-2"
                  sizes="128px"
                />
              </div>

              {/* Content card */}
              <div className="bg-card rounded-2xl border border-border p-5 text-center w-full group-hover:border-primary/20 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-sm font-heading font-bold leading-tight">
                    {client.name}
                  </h3>
                  <Quote className="h-4 w-4 text-primary/30 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;{client.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
