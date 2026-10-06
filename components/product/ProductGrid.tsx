'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

export function ProductGrid({ 
  products, 
  columns = 4,
  emptyMessage = "No handcrafted creations match your selection."
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FAF8F5] border border-neutral-200 p-8 my-4">
        <h4 className="font-serif text-lg text-neutral-800 mb-2">No Products Found</h4>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const columnClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${columnClass} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10`}>
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
}
