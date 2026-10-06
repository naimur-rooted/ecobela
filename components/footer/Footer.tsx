'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Youtube, 
  CreditCard,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#121110] text-[#D8D2C4] border-t border-[#262422]">
      {/* Top Banner highlights */}
      <div className="border-b border-[#262422] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-medium">GI Certified Weaves</h4>
              <p className="text-[11px] text-neutral-400">Authentic Sonargaon Jamdani & Rajshahi Silk</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center text-[#D4AF37]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-medium">Pan-Bangladesh Express</h4>
              <p className="text-[11px] text-neutral-400">Complimentary over ৳5,000 nationwide</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-medium">Authenticity Guarantee</h4>
              <p className="text-[11px] text-neutral-400">Every piece individually inspected & tagged</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center text-[#D4AF37]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-medium">Secure Payments</h4>
              <p className="text-[11px] text-neutral-400">bKash, Nagad, Cards & Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand story column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-flex flex-col group">
            <span className="font-serif text-3xl tracking-[0.22em] font-light text-white group-hover:text-[#D4AF37] transition-colors">
              ECOBELA
            </span>
            <span className="text-[8.5px] tracking-[0.4em] text-[#C29B38] uppercase -mt-1 font-medium">
              SUSTAINABLE HERITAGE & LIVING
            </span>
          </Link>

          <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
            Ecobela is a luxury Bangladeshi fashion and lifestyle house committed to the preservation of our five-hundred-year handloom heritage and sustainable craft traditions. From gossamer Jamdani sarees and royal Rajshahi silks to artisan home crafts.
          </p>

          <div className="pt-2 text-xs space-y-2 text-neutral-300">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Flagship Atelier: Road 11, Block D, Banani, Dhaka-1213</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Concierge: +880 9612-445566 (10 AM – 9 PM BST)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>concierge@ecobela.com</span>
            </p>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-white border-b border-[#262422] pb-2">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li><Link href="/women/saree" className="hover:text-white transition-colors">Jamdani &amp; Muslin Sarees</Link></li>
            <li><Link href="/men/panjabi" className="hover:text-white transition-colors">Festive Panjabi &amp; Koti</Link></li>
            <li><Link href="/wedding" className="hover:text-white transition-colors">Bridal Katan Trousseau</Link></li>
            <li><Link href="/jewellery" className="hover:text-white transition-colors">Kundan &amp; Pearl Jewels</Link></li>
            <li><Link href="/home-decor" className="hover:text-white transition-colors">Nakshi Kantha Living</Link></li>
            <li><Link href="/kids" className="hover:text-white transition-colors">Little Heritage (Kids)</Link></li>
          </ul>
        </div>

        {/* Client Concierge */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-white border-b border-[#262422] pb-2">
            Client Concierge
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li><Link href="/account" className="hover:text-white transition-colors">My Patron Account</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
            <li><Link href="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            <li><Link href="/special-collections" className="hover:text-white transition-colors">Our Weaver Clusters</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">Track Your Order</Link></li>
            <li><span className="text-neutral-500 cursor-not-allowed">7-Day Exchange Policy</span></li>
          </ul>
        </div>

        {/* Connect & Payments */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-white border-b border-[#262422] pb-2">
            Connect With Us
          </h4>

          {/* Social media icons */}
          <div className="flex items-center gap-3 text-neutral-300">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-[#3A3631] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-2">
            <h5 className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-2">
              Payment Methods Accepted
            </h5>
            <div className="flex flex-wrap gap-2 text-[10px] text-neutral-300">
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 font-mono">bKash</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 font-mono">Nagad</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 font-mono">Visa</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 font-mono">Mastercard</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 font-mono">AMEX</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 font-mono">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal */}
      <div className="border-t border-[#262422] py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} Ecobela Ltd. All rights reserved. Handcrafted sustainably in Bangladesh.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/" className="hover:text-neutral-300 transition-colors">GI Authenticity</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
