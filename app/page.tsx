import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductSection } from '@/components/home/ProductSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedBanners } from '@/components/home/FeaturedBanners';
import { PromotionalBanner } from '@/components/home/PromotionalBanner';
import { HomeDecorSection } from '@/components/home/HomeDecorSection';
import { Newsletter } from '@/components/home/Newsletter';
import { productsData } from '@/data/products';

export default function HomePage() {
  const newArrivals = productsData.filter((p) => p.isNew || p.featured);
  const trendingProducts = productsData.filter((p) => p.trending);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Full-Width Slider */}
      <HeroSection />

      {/* 2. New Arrivals Showcase ("LATEST ATELIER EDITIONS") immediately below Hero */}
      <ProductSection
        tagline="LATEST ATELIER EDITIONS"
        title="New Seasonal Arrivals"
        subtitle="Meticulously crafted in small batches by our hereditary artisan families."
        products={newArrivals}
        viewAllLink="/women"
        enableTabs={true}
      />

      {/* 3. Curated Categories Grid */}
      <CategoryGrid />

      {/* 4. Featured Editorial Campaigns (Bridal Atelier & Artisanal Living) */}
      <FeaturedBanners />

      {/* 5. Promotional Heritage & Artisan Story Banner */}
      <PromotionalBanner />

      {/* 6. Dedicated Home Décor Showcase */}
      <HomeDecorSection />

      {/* 7. Trending & Festive Best Sellers */}
      <ProductSection
        tagline="PATRON FAVORITES"
        title="Trending & Festive Heirlooms"
        subtitle="Celebrated creations chosen for life’s most auspicious ceremonies."
        products={trendingProducts}
        viewAllLink="/wedding"
      />

      {/* 8. Newsletter & Journal */}
      <Newsletter />
    </div>
  );
}
