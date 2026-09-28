"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
