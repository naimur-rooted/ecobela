'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductSort } from '@/components/product/ProductSort';
import { useShop } from '@/context/ShopContext';
import { useDynamicCategoryHero } from '@/hooks/useDynamicCategoryHero';
import { FilterState, SortOption } from '@/types/product';
import { SlidersHorizontal, X } from 'lucide-react';

interface CategoryViewProps {
  categorySlug: string;
  subCategorySlug?: string;
}

export function CategoryView({ categorySlug, subCategorySlug }: CategoryViewProps) {
  const { products, categories } = useShop();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('featured');

  // Find category info from dynamic shop context
  const categoryInfo = useMemo(() => {
    return (
      categories.find((c) => c.slug.toLowerCase() === categorySlug.toLowerCase()) || {
        id: categorySlug,
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' '),
        slug: categorySlug,
        description: 'Explore our handcrafted Bangladeshi fashion and lifestyle creations.',
        heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85',
        subcategories: [],
      }
    );
  }, [categories, categorySlug]);

  // Dynamic Shuffling Hero Image hook
  const { heroImage, totalImages } = useDynamicCategoryHero(
    categorySlug,
    categoryInfo.heroImage,
    6000 // Shuffle every 6 seconds
  );

  // Base products filtered by category
  const baseCategoryProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        p.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === categorySlug.toLowerCase() ||
        p.category.toLowerCase() === categoryInfo.name.toLowerCase();

      if (categorySlug === 'wedding') {
        return p.category === 'Women' || p.category === 'Men' || p.subSubCategory === 'Wedding';
      }
      if (
        categorySlug === 'eid-festive-26' ||
        categorySlug === 'festive-gift-ideas' ||
        categorySlug === 'puja-26' ||
        categorySlug === 'puja-gift-ideas'
      ) {
        return (
          p.featured ||
          p.trending ||
          p.category === 'Women' ||
          p.category === 'Home Décor' ||
          p.category === 'Jewellery' ||
          p.category.includes('Festive') ||
          p.category.includes('Eid')
        );
      }
      if (categorySlug === 'brands') {
        return true;
      }
      if (categorySlug === 'special-collections') {
        return p.featured || p.subSubCategory === 'Jamdani';
      }

      return matchCat;
    });
  }, [products, categorySlug, categoryInfo.name]);

  // Available filters from data
  const availableSubcategories = useMemo(() => {
    const subs = new Set<string>();
    if (categoryInfo.subcategories && categoryInfo.subcategories.length > 0) {
      categoryInfo.subcategories.forEach((s) => subs.add(s));
    }
    baseCategoryProducts.forEach((p) => {
      if (p.subCategory) subs.add(p.subCategory);
      if (p.subSubCategory) subs.add(p.subSubCategory);
    });
    return Array.from(subs);
  }, [categoryInfo.subcategories, baseCategoryProducts]);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    baseCategoryProducts.forEach((p) => {
      p.colors?.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [baseCategoryProducts]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    baseCategoryProducts.forEach((p) => {
      p.sizes?.forEach((s) => sizes.add(s));
    });
    return Array.from(sizes);
  }, [baseCategoryProducts]);

  const initialFilterState: FilterState = {
    subCategory: subCategorySlug ? [subCategorySlug.replace('-', ' ')] : [],
    priceRange: [0, 50000],
    colors: [],
    sizes: [],
    inStockOnly: false,
  };

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return baseCategoryProducts.filter((p) => {
      // Subcategory filter
      if (filterState.subCategory.length > 0) {
        const matchesSub = filterState.subCategory.some(
          (sub) =>
            p.subCategory.toLowerCase().includes(sub.toLowerCase()) ||
            (p.subSubCategory && p.subSubCategory.toLowerCase().includes(sub.toLowerCase()))
        );
        if (!matchesSub) return false;
      }

      // Price filter
      if (p.price > filterState.priceRange[1]) {
        return false;
      }

      // Colors filter
      if (filterState.colors.length > 0) {
        const hasColor = p.colors?.some((c) => filterState.colors.includes(c.name));
        if (!hasColor) return false;
      }

      // Sizes filter
      if (filterState.sizes.length > 0) {
        const hasSize = p.sizes?.some((s) => filterState.sizes.includes(s));
        if (!hasSize) return false;
      }

      // In stock
      if (filterState.inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    });
  }, [baseCategoryProducts, filterState]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (currentSort) {
      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
      case 'featured':
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, currentSort]);

  const breadcrumbItems = [
    { label: categoryInfo.name, href: `/${categoryInfo.slug}` },
    ...(subCategorySlug
      ? [{ label: subCategorySlug.replace('-', ' '), href: `/${categoryInfo.slug}/${subCategorySlug}` }]
      : []),
  ];

  const handleSelectSubCategoryTag = (subName: string) => {
    if (filterState.subCategory.includes(subName)) {
      setFilterState((prev) => ({
        ...prev,
        subCategory: prev.subCategory.filter((s) => s !== subName),
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        subCategory: [subName],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Aarong-Inspired Editorial Hero Banner */}
      <div className="relative h-[360px] sm:h-[460px] md:h-[520px] lg:h-[580px] w-full overflow-hidden bg-neutral-900 group">
        <Image
          key={heroImage}
          src={heroImage}
          alt={categoryInfo.name}
          fill
          priority
          className="object-cover object-center transition-all duration-1000 ease-in-out scale-100 group-hover:scale-102"
          sizes="100vw"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Vignette Gradient for High Image Clarity */}
        <div className="absolute inset-0 bg-black/25 transition-opacity" />

        {/* Centered Large Category Title (Aarong Style) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal uppercase tracking-[0.18em] drop-shadow-lg select-none">
            {categoryInfo.name}
          </h1>
        </div>
      </div>

      {/* Aarong-Inspired "SHOP BY CATEGORY" Section */}
      <div className="bg-white border-b border-neutral-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-neutral-900">
            SHOP BY CATEGORY
          </h2>

          {/* Subcategories Horizontal Filter Cards */}
          {availableSubcategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => setFilterState((prev) => ({ ...prev, subCategory: [] }))}
                className={`px-4 sm:px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-all border cursor-pointer ${
                  filterState.subCategory.length === 0
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-400'
                }`}
              >
                All {categoryInfo.name}
              </button>

              {availableSubcategories.map((sub) => {
                const isSelected = filterState.subCategory.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSelectSubCategoryTag(sub)}
                    className={`px-4 sm:px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-400'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Toolbar: Filter Toggle on mobile & Sort controls */}
        <div className="flex items-center justify-between py-4 border-y border-neutral-200 mt-2 gap-4">
          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 py-2 px-3 bg-neutral-100 text-neutral-900 text-xs uppercase tracking-wider font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <div className="flex-1">
            <ProductSort
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              totalCount={sortedProducts.length}
            />
          </div>
        </div>

        {/* Layout: Sidebar Filter on Desktop + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 pr-4">
            <div className="sticky top-24">
              <ProductFilter
                availableSubcategories={availableSubcategories}
                availableColors={availableColors}
                availableSizes={availableSizes}
                filterState={filterState}
                onFilterChange={setFilterState}
                onReset={() => setFilterState(initialFilterState)}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <ProductGrid
              products={sortedProducts}
              columns={3}
              emptyMessage="No pieces match your selected filter criteria. Try adjusting the price range or filters."
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Slide-out Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col h-full">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <span className="font-serif text-base text-neutral-900 uppercase tracking-wider">
                  Filter Creations
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ProductFilter
                  availableSubcategories={availableSubcategories}
                  availableColors={availableColors}
                  availableSizes={availableSizes}
                  filterState={filterState}
                  onFilterChange={setFilterState}
                  onReset={() => setFilterState(initialFilterState)}
                />
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium"
                >
                  View ({sortedProducts.length}) Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
