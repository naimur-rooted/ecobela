import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found — Ecobela',
    };
  }

  return {
    title: `${product.name} — Ecobela`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Ecobela`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: product.category, href: `/${product.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
    { label: product.subCategory, href: `/${product.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Product Layout: Gallery Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6">
          {/* Gallery - 7 cols on desktop */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info - 5 cols on desktop */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts
            currentProductId={product.id}
            category={product.category}
            allProducts={productsData}
          />
        </div>
      </div>
    </div>
  );
}
