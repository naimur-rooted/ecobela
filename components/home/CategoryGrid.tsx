'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { ArrowUpRight } from 'lucide-react';

export function CategoryGrid() {
  const { categories } = useShop();

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header (Aarong Style) */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#A67C1E] font-semibold">
          Curated Universe
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl text-neutral-900 font-bold uppercase tracking-[0.2em]">
          SHOP BY CATEGORY
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-light">
          From master-woven sarees and royal panjabis to heirloom jewellery and artisanal living.
        </p>
      </div>

      {/* Responsive Grid: 4 cols desktop, 2-3 cols tablet, 2 cols mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.slug}`}
            className="group relative overflow-hidden aspect-[4/5] bg-neutral-900 flex flex-col justify-center items-center text-center"
          >
            {/* Background Image */}
            <Image
              src={cat.heroImage}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-85 group-hover:opacity-95"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

            {/* Centered Large Category Title Overlay */}
            <div className="relative z-10 p-4 text-white flex flex-col items-center justify-center">
              <h3 className="font-serif text-xl sm:text-2xl font-normal uppercase tracking-[0.15em] text-white drop-shadow-md group-hover:scale-105 transition-transform">
                {cat.name}
              </h3>
              <div className="mt-2 text-[10px] uppercase tracking-widest text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold">
                <span>Explore Collection</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
