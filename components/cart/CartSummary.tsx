'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBDT } from '@/lib/utils';

export function CartSummary() {
  const { subtotal, deliveryCharge, estimatedTotal, deliveryCity, setDeliveryCity } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'ECOBELA10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponMessage({ text: '10% Ecobela Privilege Applied!' });
    } else {
      setDiscountAmount(0);
      setCouponMessage({ text: 'Invalid promo code. Try "ECOBELA10"', error: true });
    }
  };

  const finalTotal = Math.max(0, estimatedTotal - discountAmount);

  return (
    <div className="bg-[#FAF8F5] border border-neutral-200 p-6 sm:p-8 space-y-6">
      <h3 className="font-serif text-lg text-neutral-900 tracking-wider uppercase border-b border-neutral-200 pb-3 font-medium">
        Order Summary
      </h3>

      {/* Subtotal & Delivery Breakdowns */}
      <div className="space-y-3 text-xs text-neutral-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-neutral-900 text-sm">
            {formatBDT(subtotal)}
          </span>
        </div>

        {/* Delivery Location Selector */}
        <div className="pt-2 border-t border-neutral-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-800">Delivery Destination</span>
            <span className="font-mono text-neutral-900">
              {deliveryCharge === 0 ? 'Complimentary (Free)' : formatBDT(deliveryCharge)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setDeliveryCity('dhaka')}
              className={`py-2 px-3 text-[11px] font-medium border text-center transition-colors ${
                deliveryCity === 'dhaka'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              Inside Dhaka (৳80)
            </button>
            <button
              type="button"
              onClick={() => setDeliveryCity('outside')}
              className={`py-2 px-3 text-[11px] font-medium border text-center transition-colors ${
                deliveryCity === 'outside'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              Outside Dhaka (৳150)
            </button>
          </div>
          {subtotal > 5000 && (
            <p className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5" />
              <span>Orders over ৳5,000 enjoy complimentary delivery!</span>
            </p>
          )}
        </div>

        {/* Promo discount */}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 pt-2 border-t border-neutral-200/60">
            <span>Privilege Promo (ECOBELA10)</span>
            <span className="font-mono font-semibold">-{formatBDT(discountAmount)}</span>
          </div>
        )}

        {/* Total */}
        <div className="pt-4 border-t border-neutral-300 flex items-baseline justify-between text-base">
          <span className="font-serif font-medium text-neutral-900 uppercase tracking-wider text-sm">
            Total Payable
          </span>
          <span className="font-mono text-xl font-bold text-neutral-900">
            {formatBDT(finalTotal)}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyCoupon} className="pt-2">
        <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
          Privilege or Gift Voucher
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="e.g. ECOBELA10"
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium transition-colors"
          >
            Apply
          </button>
        </div>
        {couponMessage && (
          <p
            className={`text-[11px] mt-1.5 ${
              couponMessage.error ? 'text-rose-600' : 'text-emerald-700 font-medium'
            }`}
          >
            {couponMessage.text}
          </p>
        )}
      </form>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        <span>Proceed to Secure Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Trust & Guarantee */}
      <div className="pt-2 text-[11px] text-neutral-500 space-y-1.5 border-t border-neutral-200">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>Encrypted checkout with bKash, Nagad, Cards or Cash on Delivery</span>
        </div>
        <p>• 7-Day Exchange available across all Bangladesh showrooms</p>
      </div>
    </div>
  );
}
