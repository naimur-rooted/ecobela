'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBDT } from '@/lib/utils';

export function CartDrawer() {
  const {
    cartItems,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-neutral-800" />
                  <h3 className="font-serif text-lg tracking-wider uppercase text-neutral-900">
                    Shopping Bag ({totalItems})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress bar */}
              <div className="bg-[#FAF8F5] px-6 py-3 border-b border-neutral-200 text-xs">
                {remainingForFreeShipping > 0 ? (
                  <div className="space-y-1.5">
                    <p className="text-neutral-700 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                      <span>
                        Add <strong className="text-amber-900">{formatBDT(remainingForFreeShipping)}</strong> more for <strong>Complimentary Pan-BD Delivery</strong>
                      </span>
                    </p>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-800 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>You’ve unlocked <strong>Complimentary Pan-Bangladesh Shipping!</strong></span>
                  </p>
                )}
              </div>

              {/* Drawer Body - Items list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h4 className="font-serif text-lg text-neutral-900 mb-1">Your bag is empty</h4>
                    <p className="text-xs text-neutral-500 max-w-xs mb-6">
                      Explore our handcrafted Jamdani sarees, royal panjabis, and artisanal living collections.
                    </p>
                    <Link
                      href="/women"
                      onClick={closeCartDrawer}
                      className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Explore New Arrivals
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <div className="relative w-20 h-24 shrink-0 bg-neutral-100 overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={closeCartDrawer}
                              className="text-xs font-medium text-neutral-900 hover:text-amber-800 transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                            <span>Color: {item.selectedColor}</span>
                            <span>·</span>
                            <span>Size: {item.selectedSize}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                          {/* Quantity control */}
                          <div className="flex items-center border border-neutral-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-medium text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-semibold text-neutral-900 font-mono">
                              {formatBDT(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-neutral-200 p-6 bg-[#FCFBF9] space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 uppercase tracking-wider text-xs">Subtotal</span>
                    <span className="font-mono font-semibold text-neutral-900 text-base">
                      {formatBDT(subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Shipping & taxes calculated at checkout. Authentic GI craftsmanship guaranteed.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/cart"
                      onClick={closeCartDrawer}
                      className="w-full text-center py-3 border border-neutral-900 text-neutral-900 text-xs uppercase tracking-widest font-medium hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      View Bag
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCartDrawer}
                      className="w-full text-center py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
