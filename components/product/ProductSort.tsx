'use client';

import React from 'react';
import { SortOption } from '@/types/product';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

export function ProductSort({ currentSort, onSortChange, totalCount }: ProductSortProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-xs">
      <span className="text-neutral-500 font-sans">
        Showing <strong className="text-neutral-900 font-mono">{totalCount}</strong> exquisite pieces
      </span>

      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-neutral-500 hidden sm:inline flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort by:</span>
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-white border border-neutral-200 px-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
        >
          <option value="featured">Featured Atelier</option>
          <option value="newest">New Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Patron Rating</option>
        </select>
      </div>
    </div>
  );
}
