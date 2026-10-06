'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { formatBDT, calculateDiscount } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const discountPercent = calculateDiscount(product.price, product.oldPrice);
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors[0]?.name, product.sizes[0]);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Badges: Discount & Status */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {discountPercent && (
            <span className="bg-neutral-900 text-white text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#FAF8F5] text-amber-900 border border-amber-900/20 text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5">
              New
            </span>
          )}
          {product.subSubCategory && (
            <span className="hidden sm:inline-block bg-white/90 text-neutral-800 backdrop-blur-xs text-[9px] tracking-widest uppercase font-medium px-1.5 py-0.5">
              {product.subSubCategory}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all duration-200 ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/80 backdrop-blur-xs text-neutral-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Button / Action Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Subtle Category & Origin metadata */}
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-500 font-sans">
          <span>{product.category}</span>
          {product.fabricOrigin && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{product.fabricOrigin}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-sm text-neutral-900 hover:text-amber-900 transition-colors line-clamp-2 mt-1 leading-snug">
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Colors dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-neutral-300 shrink-0"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-neutral-400">+{product.colors.length - 3}</span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="mt-2 flex items-baseline gap-2 pt-1 border-t border-neutral-100">
          <span className="font-mono text-sm font-semibold text-neutral-900">
            {formatBDT(product.price)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-xs text-neutral-400 line-through">
              {formatBDT(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
