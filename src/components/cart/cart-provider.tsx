"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "ecobela.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from localStorage (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((item) => item && item.variantId));
      }
    } catch {
      // Corrupt storage — start fresh instead of breaking the app.
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.variantId === item.variantId);
      if (!existing) {
        const capped = Math.min(Math.max(quantity, 1), Math.max(item.maxQuantity, 1));
        return [...current, { ...item, quantity: capped }];
      }
      const limit = Math.max(item.maxQuantity, 1);
      return current.map((entry) =>
        entry.variantId === item.variantId
          ? { ...entry, quantity: Math.min(entry.quantity + quantity, limit), maxQuantity: item.maxQuantity }
          : entry,
      );
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((current) => current.filter((entry) => entry.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((entry) =>
          entry.variantId === variantId
            ? { ...entry, quantity: Math.min(Math.max(quantity, 0), Math.max(entry.maxQuantity, 1)) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, itemCount, subtotal, isReady, addItem, removeItem, updateQuantity, clearCart };
  }, [items, isReady, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
