import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FireKiller - Compact Fire Extinguishers for Home, Kitchen & Car",
  description:
    "Protect your home in seconds with FireKiller compact fire extinguishers. Works on Oil, Gas & Electrical fires. Free shipping, 1-year warranty.",
  keywords: [
    "fire extinguisher",
    "fire safety",
    "home safety",
    "kitchen fire",
    "car fire extinguisher",
    "FireKiller",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
