'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSort } from '@/components/product/ProductSort';
import { productsData } from '@/data/products';
import { SortOption } from '@/types/product';
import { Search } from 'lucide-react';

export function SearchResultsView() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentSort, setCurrentSort] = useState<SortOption>('featured');

  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.subSubCategory && p.subSubCategory.toLowerCase().includes(q)) ||
        (p.fabricOrigin && p.fabricOrigin.toLowerCase().includes(q))
    );
  }, [query]);

  const sortedProducts = useMemo(() => {
    const list = [...matchingProducts];
    switch (currentSort) {
      case 'newest':
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'featured':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [matchingProducts, currentSort]);

  const breadcrumbItems = [
    { label: 'Search' },
    { label: query ? `"${query}"` : 'All' },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="border-b border-neutral-200 pb-4 mt-2">
          <span className="text-[11px] uppercase tracking-widest text-[#A67C1E] font-semibold block">
            Atelier Discovery
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-0.5">
            {query ? `Search Results for "${query}"` : 'Explore Atelier Archive'}
          </h1>
        </div>

        {/* Toolbar */}
        <div className="py-4 border-b border-neutral-200">
          <ProductSort
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            totalCount={sortedProducts.length}
          />
        </div>

        {/* Grid */}
        <div className="pt-8">
          <ProductGrid
            products={sortedProducts}
            columns={4}
            emptyMessage={`We couldn't find any creations matching "${query}". Try searching for Jamdani, Panjabi, Silk, or Terracotta.`}
          />
        </div>
      </div>
    </div>
  );
}
