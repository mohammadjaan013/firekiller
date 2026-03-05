"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/vendor-enquiry", label: "Vendor Enquiry" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isLoggedIn = status === "authenticated" && session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "top-3 left-4 right-4 mx-auto max-w-6xl bg-surface/50 backdrop-blur-2xl border border-border/50 shadow-lg shadow-black/5 rounded-2xl"
          : "bg-transparent"
      }`}
    >
      <div className={`mx-auto px-4 sm:px-6 ${scrolled ? "lg:px-6" : "lg:px-8 max-w-7xl"}`}>
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src={theme === "dark" ? "/images/brand/oustfire-dark.png" : "/images/brand/oustfire-light.png"}
              alt="FireKiller"
              width={160}
              height={40}
              className="h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-lg group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-[18px] w-[18px] text-foreground/70" />
              ) : (
                <Moon className="h-[18px] w-[18px] text-foreground/70" />
              )}
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 mt-2 w-56 bg-card rounded-xl border border-border shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-semibold truncate">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        <User className="h-4 w-4" /> My Account
                      </Link>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors">
                          <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-border" />
                      <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:flex" aria-label="Log in">
                <User className="h-[18px] w-[18px] text-foreground/70" />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors" aria-label="Cart">
              <ShoppingCart className="h-[18px] w-[18px] text-foreground/70" />
              {totalItems > 0 && (
                <motion.span key={totalItems} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </Link>

            {/* CTA */}
            <Link href="/shop" className="hidden sm:inline-flex items-center px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-accent transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Buy Now
            </Link>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors" aria-label="Toggle menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden bg-surface/95 backdrop-blur-xl border-t border-border">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium hover:text-primary hover:bg-muted rounded-lg transition-colors">
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:text-primary hover:bg-muted rounded-lg transition-colors">
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:text-primary hover:bg-muted rounded-lg transition-colors">
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-muted rounded-lg transition-colors">
                      <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-500/5 rounded-lg transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:text-primary hover:bg-muted rounded-lg transition-colors">
                  <User className="h-4 w-4" /> Log In / Sign Up
                </Link>
              )}
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="block text-center mt-2 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:bg-accent transition-all">
                Buy Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
