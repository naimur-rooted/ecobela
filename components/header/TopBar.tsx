'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, MapPin, Sparkles } from 'lucide-react';

export function TopBar() {
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');

  return (
    <div className="bg-[#121110] text-[#D8D2C4] text-[11px] font-sans tracking-widest border-b border-[#2A2724] px-4 sm:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Location & Pan-Bangladesh shipping */}
        <div className="hidden md:flex items-center gap-4 text-xs font-light">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <MapPin className="w-3 h-3 text-[#C29B38]" />
            <span>Dhaka · Chittagong · Sylhet · Worldwide Delivery</span>
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">Complimentary Pan-BD Shipping on orders over ৳5,000</span>
        </div>

        {/* Center on mobile / subtle ticker */}
        <div className="flex md:hidden items-center justify-center w-full text-center gap-2">
          <Sparkles className="w-3 h-3 text-[#C29B38]" />
          <span>HERITAGE HANDLOOM COUTURE · BANGLADESH</span>
        </div>

        {/* Right: Currency & Atelier Links */}
        <div className="hidden md:flex items-center gap-5 text-neutral-300">
          <Link href="/special-collections" className="hover:text-white transition-colors">
            Our Sonargaon Weavers
          </Link>
          <span className="text-neutral-600">|</span>
          <Link href="/wedding" className="hover:text-white transition-colors text-[#D4AF37] font-medium">
            Bridal Atelier
          </Link>
          <span className="text-neutral-600">|</span>
          <div className="flex items-center gap-1 cursor-pointer">
            <Globe className="w-3 h-3 text-neutral-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'BDT' | 'USD')}
              className="bg-transparent text-neutral-300 text-[11px] cursor-pointer focus:outline-none border-none pr-1"
              aria-label="Currency Selector"
            >
              <option value="BDT" className="bg-neutral-900 text-white">BDT (৳)</option>
              <option value="USD" className="bg-neutral-900 text-white">USD ($)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
