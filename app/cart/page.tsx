'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cartItems, clearCart, totalItems } = useCart();

  const breadcrumbItems = [
    { label: 'Shopping Bag' },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mt-2 gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#A67C1E] font-semibold block">
              Your Atelier Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-0.5">
              Shopping Bag ({totalItems} {totalItems === 1 ? 'Piece' : 'Pieces'})
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-rose-600 transition-colors uppercase tracking-wider font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        {/* 2-Column Cart Layout: Items on Left, Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-neutral-200">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="pt-6">
              <Link
                href="/women"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-800 hover:text-amber-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Exploring Collections</span>
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
