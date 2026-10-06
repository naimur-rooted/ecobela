'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  Check, 
  Ruler,
  ChevronDown
} from 'lucide-react';
import { Product } from '@/types/product';
import { formatBDT, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Accordion states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    description: true,
    details: true,
    materials: false,
    shipping: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const discountPercent = calculateDiscount(product.price, product.oldPrice);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Metadata */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest font-sans mb-1.5">
          <span>{product.category} · {product.subCategory}</span>
          {product.sku && <span className="font-mono text-[11px] text-neutral-400">SKU: {product.sku}</span>}
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-neutral-900 leading-tight">
          {product.name}
        </h1>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-3 mt-2.5">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-600 font-mono">
            {product.rating || 4.9} ({product.reviewsCount || 24} patron reviews)
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-xs text-emerald-700 font-medium">In Stock & Verified</span>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-4 bg-[#FAF8F5] border border-neutral-200/80 flex items-baseline gap-3">
        <span className="font-mono text-2xl font-semibold text-neutral-900">
          {formatBDT(product.price)}
        </span>
        {product.oldPrice && (
          <span className="font-mono text-sm text-neutral-400 line-through">
            {formatBDT(product.oldPrice)}
          </span>
        )}
        {discountPercent && (
          <span className="bg-amber-900 text-white text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5">
            Save {discountPercent}%
          </span>
        )}
        <span className="text-[11px] text-neutral-500 ml-auto hidden sm:inline">
          Pan-Bangladesh VAT Included
        </span>
      </div>

      {/* Short description */}
      {product.shortDescription && (
        <p className="text-xs text-neutral-600 leading-relaxed font-sans">
          {product.shortDescription}
        </p>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600 font-medium">Color:</span>
            <span className="text-neutral-900 font-semibold">{selectedColor}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`relative w-8 h-8 rounded-full border transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105' : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600 font-medium">Size:</span>
            <button
              type="button"
              onClick={() => setShowSizeModal((v) => !v)}
              className="text-[11px] text-amber-900 hover:text-amber-950 flex items-center gap-1 font-medium"
            >
              <Ruler className="w-3 h-3" />
              <span>Sizing Guide</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-900'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizing Guide modal inline display */}
      {showSizeModal && (
        <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between font-semibold text-neutral-900">
            <span>Atelier Measurement Standard (Inches)</span>
            <button
              type="button"
              onClick={() => setShowSizeModal(false)}
              className="text-neutral-400 hover:text-neutral-900"
            >
              Close
            </button>
          </div>
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-800">
                <th className="py-1">Size</th>
                <th className="py-1">Chest / Bust</th>
                <th className="py-1">Length</th>
                <th className="py-1">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="py-1 font-medium">38 / S</td>
                <td className="py-1">38&quot; - 40&quot;</td>
                <td className="py-1">40&quot;</td>
                <td className="py-1">17.5&quot;</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">40 / M</td>
                <td className="py-1">40&quot; - 42&quot;</td>
                <td className="py-1">42&quot;</td>
                <td className="py-1">18.5&quot;</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">42 / L</td>
                <td className="py-1">42&quot; - 44&quot;</td>
                <td className="py-1">44&quot;</td>
                <td className="py-1">19.5&quot;</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">44 / XL</td>
                <td className="py-1">44&quot; - 46&quot;</td>
                <td className="py-1">45&quot;</td>
                <td className="py-1">20.5&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center border border-neutral-300 bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 font-mono font-medium text-xs text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-6 bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isAddedFeedback ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </>
            )}
          </button>

          {/* Wishlist toggle */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-3 border border-neutral-300 transition-colors ${
              inWishlist ? 'bg-rose-50 text-rose-600 border-rose-300' : 'bg-white text-neutral-700 hover:text-rose-600'
            }`}
            aria-label="Wishlist toggle"
            title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Buy Now button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full py-3.5 px-6 bg-[#A67C1E] text-white hover:bg-[#8E6A17] text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
        >
          Express Checkout (Buy Now)
        </button>
      </div>

      {/* Value Badges */}
      <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-200 text-center text-[11px] text-neutral-600">
        <div className="flex flex-col items-center gap-1">
          <Truck className="w-4 h-4 text-neutral-800" />
          <span>Complimentary Pan-BD Delivery &gt; ৳5,000</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-neutral-200 px-1">
          <ShieldCheck className="w-4 h-4 text-neutral-800" />
          <span>100% Genuine GI Handloom Heritage</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="w-4 h-4 text-neutral-800" />
          <span>7-Day Hassle-Free Exchange</span>
        </div>
      </div>

      {/* Share Link */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isCopied ? 'Link Copied to Clipboard!' : 'Share Creation'}</span>
        </button>
        {product.fabricOrigin && (
          <span className="italic text-neutral-400">Atelier: {product.fabricOrigin}</span>
        )}
      </div>

      {/* Accordions for Description, Details, Materials, Care, Shipping */}
      <div className="divide-y divide-neutral-200 border-b border-neutral-200 text-xs">
        {/* Description Accordion */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleSection('description')}
            className="w-full flex items-center justify-between text-neutral-900 font-semibold uppercase tracking-wider text-xs py-1"
          >
            <span>The Heritage Craft Story</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.description ? 'rotate-180' : ''}`} />
          </button>
          {openSections.description && (
            <div className="mt-2 text-neutral-600 leading-relaxed font-sans space-y-2">
              <p>{product.description}</p>
            </div>
          )}
        </div>

        {/* Product Details & Specifications */}
        {product.details && (
          <div className="py-3">
            <button
              type="button"
              onClick={() => toggleSection('details')}
              className="w-full flex items-center justify-between text-neutral-900 font-semibold uppercase tracking-wider text-xs py-1"
            >
              <span>Specifications & Drape</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.details ? 'rotate-180' : ''}`} />
            </button>
            {openSections.details && (
              <ul className="mt-2 space-y-1.5 list-disc list-inside text-neutral-600">
                {product.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Materials & Care */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleSection('materials')}
            className="w-full flex items-center justify-between text-neutral-900 font-semibold uppercase tracking-wider text-xs py-1"
          >
            <span>Materials & Care</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.materials ? 'rotate-180' : ''}`} />
          </button>
          {openSections.materials && (
            <div className="mt-2 space-y-2 text-neutral-600">
              {product.materials && (
                <p>
                  <strong className="text-neutral-900">Composition: </strong>
                  {product.materials}
                </p>
              )}
              {product.careInstructions && (
                <p>
                  <strong className="text-neutral-900">Care: </strong>
                  {product.careInstructions}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Shipping & Returns */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleSection('shipping')}
            className="w-full flex items-center justify-between text-neutral-900 font-semibold uppercase tracking-wider text-xs py-1"
          >
            <span>Pan-Bangladesh & Global Shipping</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.shipping ? 'rotate-180' : ''}`} />
          </button>
          {openSections.shipping && (
            <div className="mt-2 space-y-2 text-neutral-600 text-[11px] leading-relaxed">
              <p>• <strong>Dhaka City Delivery:</strong> 24 to 48 hours (৳80 or complimentary over ৳5,000).</p>
              <p>• <strong>Outside Dhaka:</strong> 3 to 5 business days via premium air-conditioned logistics (৳150).</p>
              <p>• <strong>International Express:</strong> 5 to 7 days via DHL Express worldwide.</p>
              <p>• <strong>Exchange Policy:</strong> 7 days from delivery date in original unwashed condition with security tag attached.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
