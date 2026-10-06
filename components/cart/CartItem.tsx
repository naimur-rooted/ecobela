'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { formatBDT } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="py-6 flex flex-col sm:flex-row gap-5 border-b border-neutral-200">
      {/* Product Image */}
      <div className="relative w-24 h-32 sm:w-28 sm:h-36 shrink-0 bg-neutral-100 overflow-hidden">
        <Link href={`/product/${item.product.slug}`}>
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="120px"
            referrerPolicy="no-referrer"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-sans">
                {item.product.category} · {item.product.subCategory}
              </span>
              <h3 className="font-serif text-base text-neutral-900 mt-0.5">
                <Link href={`/product/${item.product.slug}`} className="hover:text-amber-900 transition-colors">
                  {item.product.name}
                </Link>
              </h3>
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-600 mt-2">
            <span>Color: <strong>{item.selectedColor}</strong></span>
            <span>·</span>
            <span>Size: <strong>{item.selectedSize}</strong></span>
          </div>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
          <div className="flex items-center border border-neutral-300 bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2.5 py-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-mono font-medium text-neutral-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2.5 py-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-500 font-mono block sm:inline mr-2">
              {formatBDT(item.product.price)} each
            </span>
            <span className="font-mono text-base font-semibold text-neutral-900">
              {formatBDT(item.product.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
