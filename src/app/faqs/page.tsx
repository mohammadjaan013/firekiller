"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

const faqCategories = [
  {
    title: "Product & Usage",
    faqs: [
      {
        q: "What types of fires can FireKiller extinguish?",
        a: "FireKiller works on Class A (solid materials), Class B (flammable liquids like oil), Class C (gas fires), and Electrical fires. It's a multi-class fire extinguisher suitable for homes, kitchens, and cars.",
      },
      {
        q: "How long does a FireKiller extinguisher last?",
        a: "FireKiller extinguishers have a shelf life of 5 years from the date of manufacture. They require zero maintenance during this period and are always ready to use.",
      },
      {
        q: "Is FireKiller safe to use in enclosed spaces?",
        a: "Yes, FireKiller uses a non-toxic, eco-friendly extinguishing agent that is safe for use in enclosed spaces like kitchens, bedrooms, and cars. It leaves minimal residue.",
      },
      {
        q: "How do I use the PanSafe Kitchen Sachet?",
        a: "Simply throw the PanSafe sachet directly into the burning pan. The sachet will burst on contact with fire and release the extinguishing agent, putting out the fire in seconds. No aiming required.",
      },
      {
        q: "Can children or elderly people use FireKiller?",
        a: "Absolutely. FireKiller is designed with a simple squeeze-and-spray mechanism. No pins to pull, no complex instructions. Anyone can use it in an emergency.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    faqs: [
      {
        q: "Do you offer free shipping?",
        a: "Yes, we offer free shipping on all orders across India. Orders are typically delivered within 3-7 business days depending on your location.",
      },
      {
        q: "Is Cash on Delivery (COD) available?",
        a: "Yes, we offer COD on all orders. You can also pay via UPI, credit/debit cards, net banking, and popular wallets.",
      },
      {
        q: "Can I track my order?",
        a: "Yes, once your order is shipped, you'll receive a tracking link via SMS and email. You can also track your order from your account dashboard.",
      },
      {
        q: "What is the return policy?",
        a: "We offer a 7-day return policy for unused and unopened products. If you receive a damaged product, we'll replace it free of charge.",
      },
    ],
  },
  {
    title: "Warranty & Support",
    faqs: [
      {
        q: "What warranty do FireKiller products come with?",
        a: "All FireKiller products come with a 1-year manufacturer warranty covering any defects in materials or workmanship. The warranty does not cover damage from misuse or accidental discharge.",
      },
      {
        q: "How can I contact customer support?",
        a: "You can reach us via email at support@firekiller.in, call us at +91 98765 43210 (24x7), or use the Contact Us form on our website.",
      },
      {
        q: "Do you offer bulk/corporate pricing?",
        a: "Yes, we offer special pricing for bulk orders and corporate clients. Please fill out the Vendor Enquiry form or contact our sales team directly.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0);

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Find answers to common questions about FireKiller products
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {filteredCategories.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-lg font-bold text-secondary mb-4">
              {cat.title}
            </h2>
            <div className="space-y-3">
              {cat.faqs.map((faq, i) => {
                const key = `${cat.title}-${i}`;
                const isOpen = openIndex === key;
                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-secondary pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No questions match your search. Try a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
