'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronDown, 
  User, 
  Heart, 
  ShoppingBag, 
  Sparkles,
  Search,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { navigationCategories } from '@/data/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { SearchBar } from './SearchBar';

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavbar({ isOpen, onClose }: MobileNavbarProps) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [expandedSubIdx, setExpandedSubIdx] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { currentUser } = useAuth();
  const { totalWishlistItems } = useWishlist();
  const { totalItems, openCartDrawer } = useCart();

  const toggleCategory = (id: string) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
    setExpandedSubIdx(null);
  };

  const toggleSub = (key: string) => {
    setExpandedSubIdx(expandedSubIdx === key ? null : key);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-[#121110] text-white">
              <Link href="/" onClick={onClose} className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.22em] font-light">ECOBELA</span>
                <span className="text-[8.5px] tracking-[0.35em] text-[#C29B38] uppercase">Sustainable Heritage</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-neutral-300 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick search input */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50">
              <SearchBar onClose={onClose} isMobileModal={true} />
            </div>

            {/* Navigation links & Accordions */}
            <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-neutral-100">
              {navigationCategories.map((cat) => {
                const isExpanded = expandedCategoryId === cat.id;
                const hasColumns = cat.columns && cat.columns.length > 0;

                return (
                  <div key={cat.id} className="py-2.5">
                    <div className="flex items-center justify-between">
                      <Link
                        href={cat.href}
                        onClick={onClose}
                        className="text-xs uppercase tracking-widest font-semibold text-neutral-800 hover:text-amber-800 transition-colors py-1 flex-1"
                      >
                        {cat.name}
                      </Link>

                      {hasColumns && (
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                          aria-label={`Toggle ${cat.name} submenu`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-amber-800' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Accordion content */}
                    {hasColumns && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-3 mt-2 space-y-3 border-l-2 border-neutral-200"
                      >
                        {cat.columns?.map((col, colIdx) => (
                          <div key={colIdx} className="space-y-2">
                            {col.items && (
                              <div className="space-y-1.5">
                                {col.title && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                                    {col.title}
                                  </span>
                                )}
                                <div className="space-y-1 pl-1">
                                  {col.items.map((item, itemIdx) => {
                                    const subKey = `${colIdx}-${itemIdx}`;
                                    const isSubOpen = expandedSubIdx === subKey;

                                    return (
                                      <div key={itemIdx} className="text-xs">
                                        <div className="flex items-center justify-between">
                                          <Link
                                            href={`/${cat.slug}/${item.slug}`}
                                            onClick={onClose}
                                            className="text-neutral-700 hover:text-amber-800 py-1 block font-medium"
                                          >
                                            {item.name}
                                          </Link>
                                          {item.subItems && item.subItems.length > 0 && (
                                            <button
                                              type="button"
                                              onClick={() => toggleSub(subKey)}
                                              className="p-1 text-neutral-400"
                                            >
                                              <ChevronDown
                                                className={`w-3 h-3 transition-transform ${
                                                  isSubOpen ? 'rotate-180' : ''
                                                }`}
                                              />
                                            </button>
                                          )}
                                        </div>

                                        {item.subItems && isSubOpen && (
                                          <div className="pl-3 py-1 space-y-1 border-l border-neutral-100">
                                            {item.subItems.map((sub, sIdx) => (
                                              <Link
                                                key={sIdx}
                                                href={`/${cat.slug}/${item.slug}?sub=${sub.slug}`}
                                                onClick={onClose}
                                                className="block text-[11px] text-neutral-500 hover:text-amber-900 py-0.5"
                                              >
                                                {sub.name}
                                              </Link>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {col.sections &&
                              col.sections.map((sec, secIdx) => (
                                <div key={secIdx} className="space-y-1.5 pt-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                                    {sec.title}
                                  </span>
                                  <div className="space-y-1 pl-1">
                                    {sec.items.map((item, itemIdx) => {
                                      const subKey = `sec-${colIdx}-${secIdx}-${itemIdx}`;
                                      const isSubOpen = expandedSubIdx === subKey;

                                      return (
                                        <div key={itemIdx} className="text-xs">
                                          <div className="flex items-center justify-between">
                                            <Link
                                              href={`/${cat.slug}/${item.slug}`}
                                              onClick={onClose}
                                              className="text-neutral-700 hover:text-amber-800 py-1 block font-medium"
                                            >
                                              {item.name}
                                            </Link>
                                            {item.subItems && item.subItems.length > 0 && (
                                              <button
                                                type="button"
                                                onClick={() => toggleSub(subKey)}
                                                className="p-1 text-neutral-400"
                                              >
                                                <ChevronDown
                                                  className={`w-3 h-3 transition-transform ${
                                                    isSubOpen ? 'rotate-180' : ''
                                                  }`}
                                                />
                                              </button>
                                            )}
                                          </div>

                                          {item.subItems && isSubOpen && (
                                            <div className="pl-3 py-1 space-y-1 border-l border-neutral-100">
                                              {item.subItems.map((sub, sIdx) => (
                                                <Link
                                                  key={sIdx}
                                                  href={`/${cat.slug}/${item.slug}?sub=${sub.slug}`}
                                                  onClick={onClose}
                                                  className="block text-[11px] text-neutral-500 hover:text-amber-900 py-0.5"
                                                >
                                                  {sub.name}
                                                </Link>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Drawer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href={currentUser ? '/account' : '/login'}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-neutral-200 text-neutral-800 hover:border-neutral-400 transition-colors uppercase tracking-wider text-[11px] font-medium"
                >
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{currentUser ? 'My Account' : 'Sign In'}</span>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-neutral-200 text-neutral-800 hover:border-neutral-400 transition-colors uppercase tracking-wider text-[11px] font-medium relative"
                >
                  <Heart className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openCartDrawer();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Bag ({totalItems})</span>
              </button>

              <div className="pt-2 text-[10px] text-neutral-500 text-center flex items-center justify-center gap-2">
                <MapPin className="w-3 h-3 text-amber-800" />
                <span>Flagship Atelier: Banani 11, Dhaka</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
