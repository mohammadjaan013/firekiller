"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Building2,
  User,
  FileText,
} from "lucide-react";

export default function ContactPage() {
  const [tab, setTab] = useState<"customer" | "vendor">("customer");

  // Customer form
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  // Vendor form
  const [vendorSubmitted, setVendorSubmitted] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorError, setVendorError] = useState("");
  const [vendorForm, setVendorForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    businessType: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendorForm({ ...vendorForm, [e.target.name]: e.target.value });
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.businessType || vendorForm.businessType === "Select business type") {
      setVendorError("Please select a business type");
      return;
    }
    setVendorLoading(true);
    setVendorError("");
    try {
      const res = await fetch("/api/vendor-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit enquiry");
      setVendorSubmitted(true);
    } catch (err) {
      setVendorError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setVendorLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Have questions about our products or need assistance? We&apos;re
            here to help 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: Phone,
                title: "Call Us",
                detail: "+91 93242 59477",
                sub: "Mon-Sat, 9AM-6PM IST",
              },
              {
                icon: Mail,
                title: "Email Us",
                detail: "sales@oustfire.com",
                sub: "We reply within 24 hours",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                detail: "OustFire Safety Engineers Pvt. Ltd.",
                sub: "Laxmiwadi, Patil House, 394, Thane - Belapur Rd, near SI Group, MIDC Industrial Area, Juinagar, Navi Mumbai, MH 400705",
              },
              {
                icon: Clock,
                title: "Business Hours",
                detail: "Mon - Sat: 9AM - 6PM",
                sub: "Sunday: Closed",
              },
            ].map(({ icon: Icon, title, detail, sub }) => (
              <div
                key={title}
                className="flex items-start gap-4 bg-card rounded-xl p-5 border border-border"
              >
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary text-sm">
                    {title}
                  </h3>
                  <p className="text-sm text-secondary mt-0.5">{detail}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* Tab selector */}
            <div className="flex gap-1 mb-4 bg-muted/40 border border-border rounded-xl p-1 w-fit">
              <button
                type="button"
                onClick={() => setTab("customer")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === "customer" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-secondary"
                }`}
              >
                Customer Support
              </button>
              <button
                type="button"
                onClick={() => setTab("vendor")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === "vendor" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-secondary"
                }`}
              >
                Vendor / Distributor
              </button>
            </div>

            {tab === "vendor" ? (
              vendorSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-2xl p-12 text-center border border-border"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-secondary mb-2">Enquiry Submitted!</h2>
                  <p className="text-muted-foreground">
                    Our team will review your application and get back to you within 2–3 business days.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleVendorSubmit}
                  className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-secondary">Vendor / Distributor Enquiry</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="text" name="name" value={vendorForm.name} onChange={handleVendorChange} required placeholder="John Doe" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Company Name *</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="text" name="company" value={vendorForm.company} onChange={handleVendorChange} required placeholder="Company Pvt. Ltd." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="email" name="email" value={vendorForm.email} onChange={handleVendorChange} required placeholder="you@company.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="tel" name="phone" value={vendorForm.phone} onChange={handleVendorChange} required placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">City / Region *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="text" name="city" value={vendorForm.city} onChange={handleVendorChange} required placeholder="New Delhi, India" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Business Type *</label>
                      <select name="businessType" value={vendorForm.businessType} onChange={handleVendorChange} className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                        <option value="">Select business type</option>
                        <option>Distributor</option>
                        <option>Retailer</option>
                        <option>E-commerce Seller</option>
                        <option>Corporate / Bulk Buyer</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">Message</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <textarea rows={4} name="message" value={vendorForm.message} onChange={handleVendorChange} placeholder="Tell us about your business and how you'd like to partner..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none" />
                    </div>
                  </div>

                  {vendorError && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{vendorError}</p>}

                  <button type="submit" disabled={vendorLoading} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50">
                    <Send className="h-4 w-4" />
                    {vendorLoading ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </form>
              )
            ) : submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-12 text-center border border-border"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-secondary mb-2">
                  Message Sent!
                </h2>
                <p className="text-muted-foreground">
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-secondary">
                    Send a Message
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    <option>General Inquiry</option>
                    <option>Product Question</option>
                    <option>Order Support</option>
                    <option>Return / Refund</option>
                    <option>Business Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
