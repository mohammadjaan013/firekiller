import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FireKiller - Seconds Save Lives",
  description:
    "India's most trusted compact fire extinguishers. Protect your home, kitchen & car. Free shipping, 1-year warranty, COD available.",
  icons: {
    icon: "/images/favicon4.png",
  },
  keywords: [
    "fire extinguisher",
    "fire safety",
    "home safety",
    "kitchen fire",
    "car fire extinguisher",
    "FireKiller",
    "PanSafe",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
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
