"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

// ─── Types ──────────────────────────────────────────────

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  savings: number;
  discount: number;
  appliedCoupon: string;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

// ─── Context ────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "firekiller-cart";
const COUPON_KEY = "firekiller-coupon";

// ─── Provider ───────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const prevStatusRef = useRef<string>("loading");

  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load cart + coupon from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
      const savedCoupon = localStorage.getItem(COUPON_KEY);
      if (savedCoupon) {
        const { code, discount: d } = JSON.parse(savedCoupon);
        setAppliedCoupon(code);
        setDiscount(d);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  // React to auth state transitions
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;

    if (prev === "loading") return; // skip initial resolution

    if (prev === "unauthenticated" && status === "authenticated") {
      // Guest just logged in — keep cart items but clear coupon
      // (coupon was validated against guest subtotal; user must re-apply)
      setAppliedCoupon("");
      setDiscount(0);
    } else if (prev === "authenticated" && status === "unauthenticated") {
      // User just signed out — clear everything so next user starts fresh
      setItems([]);
      setAppliedCoupon("");
      setDiscount(0);
    }
  }, [status]);

  // Persist coupon
  useEffect(() => {
    if (hydrated) {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_KEY, JSON.stringify({ code: appliedCoupon, discount }));
      } else {
        localStorage.removeItem(COUPON_KEY);
      }
    }
  }, [appliedCoupon, discount, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    []
  );

  const removeItem = useCallback((id: number | string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number | string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setAppliedCoupon("");
  }, []);

  const applyCoupon = useCallback((code: string, amt: number) => {
    setAppliedCoupon(code);
    setDiscount(amt);
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon("");
    setDiscount(0);
  }, []);

  const isInCart = useCallback(
    (id: number | string) => items.some((i) => i.id === id),
    [items]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = items.reduce(
    (sum, i) => sum + (i.originalPrice - i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        savings,
        discount,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return context;
}
