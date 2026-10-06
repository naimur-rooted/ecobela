'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatBDT } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();

  const breadcrumbItems = [{ label: 'Saved Wishlist' }];

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-neutral-200 flex items-center justify-center text-neutral-400 mb-6">
          <Heart className="w-10 h-10 stroke-[1.2]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mb-2 font-normal">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-8 font-light leading-relaxed">
          Curate your personal collection of coveted Jamdani sarees, fine silks, and artisanal living artifacts.
        </p>
        <Link
          href="/women"
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
        >
          <span>Explore Collections</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="border-b border-neutral-200 pb-4 mt-2">
          <span className="text-[11px] uppercase tracking-widest text-[#A67C1E] font-semibold block">
            Personal Atelier Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-0.5">
            Saved Wishlist ({totalWishlistItems} {totalWishlistItems === 1 ? 'Piece' : 'Pieces'})
          </h1>
        </div>

        {/* Grid of Wishlist Items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
          {wishlistItems.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-white border border-neutral-200">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-neutral-600 hover:text-rose-600 hover:bg-white shadow-xs transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-sm text-neutral-900 mt-1 line-clamp-2">
                    <Link href={`/product/${product.slug}`} className="hover:text-amber-900 transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="mt-2 font-mono text-sm font-semibold text-neutral-900">
                    {formatBDT(product.price)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, 1, product.colors[0]?.name, product.sizes[0])}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
