import React from 'react';
import type { Metadata } from 'next';
import { CategoryView } from '@/components/category/CategoryView';
import { mainCategoriesData } from '@/data/categories';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const found = mainCategoriesData.find((c) => c.slug === category);
  const name = found ? found.name : category.toUpperCase();

  return {
    title: `${name} — Ecobela Atelier`,
    description: found?.description || `Explore our handloom ${name} collection from Bangladesh at Ecobela.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  return <CategoryView categorySlug={category} />;
}
