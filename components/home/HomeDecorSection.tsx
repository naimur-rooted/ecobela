'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { productsData } from '@/data/products';
import { ProductCard } from '../product/ProductCard';

export function HomeDecorSection() {
  const decorProducts = productsData.filter((p) => p.category === 'Home Décor').slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Feature Editorial Card */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A67C1E] font-semibold">
              Artisan Spaces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal leading-tight">
              Bengal Heritage for the Modern Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Transform your living spaces with hand-stitched Jessore nakshi kantha quilts, Dhamrai cast brass lanterns, and wheel-thrown red clay urlis. Each object carries the tactile warmth of handcrafted artistry.
            </p>
            <div className="pt-2">
              <Link
                href="/home-decor"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-900 font-semibold hover:text-amber-900 transition-colors border-b border-neutral-900 pb-1"
              >
                <span>View Home Living Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {decorProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
