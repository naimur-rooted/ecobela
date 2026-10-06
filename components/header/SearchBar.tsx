'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { productsData } from '@/data/products';
import { formatBDT } from '@/lib/utils';

interface SearchBarProps {
  onClose?: () => void;
  isMobileModal?: boolean;
}

export function SearchBar({ onClose, isMobileModal = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pure derived search results using useMemo
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    return productsData
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.subSubCategory && p.subSubCategory.toLowerCase().includes(q)) ||
          (p.fabricOrigin && p.fabricOrigin.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [query]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onClose) onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    if (onClose) onClose();
    router.push(`/product/${slug}`);
  };

  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    <div ref={containerRef} className={`relative ${isMobileModal ? 'w-full' : 'w-56 sm:w-64 md:w-72 lg:w-80'}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder="Search products"
          aria-label="Search products"
          className="w-full pl-9 pr-8 py-2 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-xs text-neutral-900 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all rounded-xs placeholder:text-neutral-500 focus:outline-none"
        />
        <Search className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 p-0.5 text-neutral-400 hover:text-neutral-700"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Live autocomplete dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 shadow-xl z-50 overflow-hidden divide-y divide-neutral-100 animate-in fade-in-50 duration-150">
          {results.length > 0 ? (
            <div>
              <div className="px-3.5 py-2 text-[10px] uppercase tracking-wider font-semibold text-neutral-400 bg-neutral-50 flex items-center justify-between">
                <span>Matching Products</span>
                <span>{results.length} found</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-50">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="w-full text-left p-2.5 sm:p-3 flex items-center gap-3 hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                  >
                    <div className="relative w-12 h-14 shrink-0 bg-neutral-100 overflow-hidden border border-neutral-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="48px"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                        {product.category}
                      </span>
                      <p className="text-xs font-medium text-neutral-900 truncate group-hover:text-amber-900 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-neutral-600 font-mono mt-0.5 font-semibold">
                        {formatBDT(product.price)}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                  </button>
                ))}
              </div>
              <div className="p-2.5 bg-neutral-50 text-center border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-semibold text-neutral-900 hover:text-amber-900 flex items-center justify-center gap-1.5 w-full uppercase tracking-wider text-[11px]"
                >
                  <span>View all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 text-center text-xs text-neutral-500 space-y-1">
              <p className="font-medium text-neutral-800">No products found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-neutral-400">
                Try searching for Jamdani, Panjabi, Saree, Silk, or Terracotta.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
