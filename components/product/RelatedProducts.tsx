'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  allProducts: Product[];
}

export function RelatedProducts({ currentProductId, category, allProducts }: RelatedProductsProps) {
  const related = allProducts
    .filter((p) => p.id !== currentProductId && p.category === category)
    .slice(0, 4);

  if (related.length === 0) {
    // Fallback to any other 4 products
    const otherProducts = allProducts.filter((p) => p.id !== currentProductId).slice(0, 4);
    if (otherProducts.length === 0) return null;
    return (
      <section className="pt-16 border-t border-neutral-200">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-widest text-[#A67C1E] font-medium">Curated Pairing</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mt-1">You May Also Admire</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {otherProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="pt-16 border-t border-neutral-200">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-widest text-[#A67C1E] font-medium">Curated Pairing</span>
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mt-1">Complementary Creations</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
