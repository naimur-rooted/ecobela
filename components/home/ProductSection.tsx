'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight } from 'lucide-react';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  products: Product[];
  viewAllLink?: string;
  enableTabs?: boolean;
}

export function ProductSection({
  title,
  subtitle,
  tagline,
  products,
  viewAllLink = '/women',
  enableTabs = false,
}: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men' | 'living'>('all');

  const filteredProducts = enableTabs
    ? activeTab === 'all'
      ? products
      : products.filter((p) => {
          if (activeTab === 'women') return p.category === 'Women';
          if (activeTab === 'men') return p.category === 'Men';
          if (activeTab === 'living') return p.category === 'Home Décor';
          return true;
        })
    : products;

  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
        <div>
          {tagline && (
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A67C1E] font-semibold block mb-1">
              {tagline}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-light">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tab filters if enabled */}
        {enableTabs && (
          <div className="flex items-center gap-1 bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Ateliers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('women')}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'women' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Women
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('men')}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'men' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('living')}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'living' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Home Décor
            </button>
          </div>
        )}

        {/* View All link */}
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-900 hover:text-amber-900 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile View All Button */}
      {viewAllLink && (
        <div className="mt-8 text-center md:hidden">
          <Link
            href={viewAllLink}
            className="inline-flex items-center justify-center gap-2 w-full py-3 border border-neutral-900 text-xs uppercase tracking-widest text-neutral-900 font-medium hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <span>View Full Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
