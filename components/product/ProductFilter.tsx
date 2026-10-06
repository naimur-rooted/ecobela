'use client';

import React from 'react';
import { FilterState } from '@/types/product';
import { RotateCcw, Check } from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface ProductFilterProps {
  availableSubcategories: string[];
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  maxPrice?: number;
}

export function ProductFilter({
  availableSubcategories,
  availableColors,
  availableSizes,
  filterState,
  onFilterChange,
  onReset,
  maxPrice = 40000,
}: ProductFilterProps) {
  const toggleSubcategory = (sub: string) => {
    const next = filterState.subCategory.includes(sub)
      ? filterState.subCategory.filter((s) => s !== sub)
      : [...filterState.subCategory, sub];
    onFilterChange({ ...filterState, subCategory: next });
  };

  const toggleColor = (colorName: string) => {
    const next = filterState.colors.includes(colorName)
      ? filterState.colors.filter((c) => c !== colorName)
      : [...filterState.colors, colorName];
    onFilterChange({ ...filterState, colors: next });
  };

  const toggleSize = (size: string) => {
    const next = filterState.sizes.includes(size)
      ? filterState.sizes.filter((s) => s !== size)
      : [...filterState.sizes, size];
    onFilterChange({ ...filterState, sizes: next });
  };

  const handlePriceChange = (val: number) => {
    onFilterChange({ ...filterState, priceRange: [filterState.priceRange[0], val] });
  };

  const toggleInStock = () => {
    onFilterChange({ ...filterState, inStockOnly: !filterState.inStockOnly });
  };

  const hasActiveFilters =
    filterState.subCategory.length > 0 ||
    filterState.colors.length > 0 ||
    filterState.sizes.length > 0 ||
    filterState.priceRange[1] < maxPrice ||
    filterState.inStockOnly;

  return (
    <div className="space-y-6 text-xs text-neutral-800">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <span className="font-serif text-sm tracking-wider uppercase text-neutral-900 font-medium">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-amber-900 hover:text-amber-950 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-900">
            Category
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map((sub) => {
              const checked = filterState.subCategory.includes(sub);
              return (
                <label
                  key={sub}
                  className="flex items-center gap-2 cursor-pointer hover:text-neutral-950 py-0.5 select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSubcategory(sub)}
                    className="w-3.5 h-3.5 rounded-none border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
                  />
                  <span className={checked ? 'font-medium text-neutral-950' : 'text-neutral-600'}>
                    {sub}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-2.5 pt-3 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-900">
            Max Price
          </h4>
          <span className="font-mono text-neutral-900 font-semibold">
            {formatBDT(filterState.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="2000"
          max={maxPrice}
          step="500"
          value={filterState.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-1 bg-neutral-200 accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
          <span>৳2,000</span>
          <span>{formatBDT(maxPrice)}</span>
        </div>
      </div>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-neutral-100">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-900">
            Size
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => {
              const active = filterState.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors border ${
                    active
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-neutral-100">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-900">
            Color Palette
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const active = filterState.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color.name)}
                  className={`relative w-6 h-6 rounded-full border transition-transform ${
                    active ? 'scale-110 ring-2 ring-neutral-900 ring-offset-1' : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                >
                  {active && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* In Stock Only */}
      <div className="pt-3 border-t border-neutral-100">
        <label className="flex items-center gap-2 cursor-pointer hover:text-neutral-950 select-none">
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={toggleInStock}
            className="w-3.5 h-3.5 rounded-none border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
          />
          <span className="text-neutral-700">In Stock Ready to Ship</span>
        </label>
      </div>
    </div>
  );
}
