import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchResultsView } from '@/components/search/SearchResultsView';

export const metadata: Metadata = {
  title: 'Search Atelier Creations — Ecobela',
  description: 'Search handcrafted Jamdani sarees, royal panjabis, fine silks, and artisanal living collections at Ecobela.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-24 text-center text-xs text-neutral-500">Searching archive...</div>}>
      <SearchResultsView />
    </Suspense>
  );
}
