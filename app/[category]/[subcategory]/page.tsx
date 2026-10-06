import React from 'react';
import type { Metadata } from 'next';
import { CategoryView } from '@/components/category/CategoryView';

interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params;
  const catName = category.charAt(0).toUpperCase() + category.slice(1);
  const subName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ');

  return {
    title: `${subName} — ${catName} | Ecobela`,
    description: `Discover artisanal ${subName} in our ${catName} collection at Ecobela.`,
  };
}

export default async function SubCategoryPage({ params }: Props) {
  const { category, subcategory } = await params;

  return <CategoryView categorySlug={category} subCategorySlug={subcategory} />;
}
