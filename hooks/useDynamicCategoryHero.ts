'use client';

import { useState, useEffect, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';

export function useDynamicCategoryHero(
  categorySlug: string,
  fallbackImage: string,
  intervalMs = 6000
) {
  const { products, categories } = useShop();

  // Find category info
  const category = useMemo(() => {
    return categories.find(
      (c) =>
        c.slug.toLowerCase() === categorySlug.toLowerCase() ||
        c.id.toLowerCase() === categorySlug.toLowerCase()
    );
  }, [categories, categorySlug]);

  // Extract all available product images for this category
  const imagePool = useMemo(() => {
    const slugLower = categorySlug.toLowerCase();
    const categoryNameLower = category ? category.name.toLowerCase() : '';

    const matchingProducts = products.filter((p) => {
      const pCatSlug = p.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const pCatName = p.category.toLowerCase();
      if (pCatSlug === slugLower || (categoryNameLower && pCatName === categoryNameLower)) {
        return true;
      }
      if (slugLower === 'wedding') {
        return p.category === 'Women' || p.category === 'Men' || p.subSubCategory === 'Wedding';
      }
      if (slugLower === 'eid-festive-26' || slugLower === 'festive-gift-ideas') {
        return p.category.includes('Festive') || p.category.includes('Eid');
      }
      return false;
    });

    const collectedImages: string[] = [];
    matchingProducts.forEach((prod) => {
      if (prod.images && prod.images.length > 0) {
        prod.images.forEach((img) => {
          if (img && !collectedImages.includes(img)) {
            collectedImages.push(img);
          }
        });
      }
    });

    return collectedImages;
  }, [products, categorySlug, category]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Periodic shuffling/rotation algorithm
  useEffect(() => {
    if (imagePool.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePool.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [imagePool, intervalMs]);

  // Current Hero Image URL: uses dynamic shuffled product image if available, else fallback
  const heroImage = imagePool.length > 0 ? imagePool[currentIndex % imagePool.length] : (category?.heroImage || fallbackImage);

  return {
    heroImage,
    imagePool,
    currentIndex,
    totalImages: imagePool.length,
  };
}
