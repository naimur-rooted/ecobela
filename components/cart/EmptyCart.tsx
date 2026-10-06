'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="py-20 text-center max-w-md mx-auto px-4">
      <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-neutral-200 mx-auto flex items-center justify-center text-neutral-400 mb-6">
        <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mb-2 font-normal">
        Your Shopping Bag is Empty
      </h2>

      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-8 font-light">
        You haven’t selected any artisanal pieces yet. Immerse yourself in our collection of hand-woven Jamdani sarees, Rajshahi silks, and heirloom lifestyle artifacts.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/women"
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
        >
          <span>Explore Women’s Atelier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/men"
          className="px-8 py-3.5 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-medium hover:border-neutral-900 transition-colors inline-flex items-center justify-center"
        >
          <span>Men’s Festive</span>
        </Link>
      </div>
    </div>
  );
}
