'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  ChevronDown,
  MapPin,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { MegaMenu } from './MegaMenu';
import { MobileNavbar } from './MobileNavbar';
import { CartDrawer } from './CartDrawer';
import { navigationCategories } from '@/data/navigation';
import { NavCategory } from '@/types/category';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export function Header() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'BDT' | 'USD'>('BDT');

  const { currentUser } = useAuth();
  const { totalWishlistItems } = useWishlist();
  const { totalItems, openCartDrawer } = useCart();
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setActiveCategory(null);
    setIsMobileMenuOpen(false);
  }

  // Detect scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const handleMouseEnter = (cat: NavCategory) => {
    // Clear any pending leave/close timer
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (cat.hasMegaMenu && cat.columns && cat.columns.length > 0) {
      if (activeCategory) {
        // If a mega menu is already open, switch immediately without jitter
        if (enterTimerRef.current) {
          clearTimeout(enterTimerRef.current);
          enterTimerRef.current = null;
        }
        setActiveCategory(cat);
      } else {
        // If opening from scratch, small delay prevents accidental flickers
        if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => {
          setActiveCategory(cat);
        }, 60);
      }
    } else {
      if (enterTimerRef.current) {
        clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      setActiveCategory(null);
    }
  };

  const handleMouseLeave = () => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 220);
  };

  const handleMenuMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className={`bg-[#121110] text-[#D8D2C4] text-[11px] font-sans tracking-wider border-b border-[#2A2724] px-4 sm:px-8 transition-all duration-300 ${isScrolled ? 'py-1 text-[10px]' : 'py-1.5'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-xs font-light">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3 h-3 text-[#C29B38]" />
              <span>Complimentary Pan-Bangladesh Delivery on orders over ৳5,000</span>
            </span>
          </div>
          <div className="flex md:hidden items-center justify-center w-full text-center text-[10px] tracking-widest text-[#E5D7B7]">
            <span>HERITAGE HANDLOOM COUTURE · FREE PAN-BD DELIVERY OVER ৳5,000</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-300 text-[11px]">
            <Link href="/wedding" className="hover:text-white transition-colors text-[#D4AF37] font-medium">
              Bridal Atelier
            </Link>
            <span className="text-neutral-600">|</span>
            <Link href="/special-collections" className="hover:text-white transition-colors">
              Sonargaon Weavers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div
        className={`w-full bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md border-b border-neutral-200' : 'border-b border-neutral-200'
        }`}
      >
        {/* Top Header Row: Logo, Brand Navigation, Search, Location, Currency, Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile hamburger & search icons */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-neutral-800 hover:text-neutral-900 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((v) => !v)}
              className="p-1.5 text-neutral-800 hover:text-neutral-900 transition-colors"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Left: Brand Logo & Sub-Brand Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="inline-flex flex-col group shrink-0">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-light text-neutral-900 group-hover:text-amber-900 transition-colors">
                ECOBELA
              </span>
              <span className="text-[8px] tracking-[0.38em] text-[#A67C1E] uppercase font-sans -mt-1 font-semibold">
                HERITAGE & LIVING
              </span>
            </Link>

            {/* Brand navigation links beside logo */}
            <nav className="hidden xl:flex items-center gap-3 text-[11px] uppercase tracking-wider font-semibold text-neutral-500 pl-4 border-l border-neutral-200">
              <Link href="/" className="text-neutral-900 font-bold hover:text-amber-900 transition-colors">
                ECOBELA
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/special-collections" className="hover:text-neutral-900 transition-colors">
                TAAGA
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/men" className="hover:text-neutral-900 transition-colors">
                TAAGA MAN
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/brands" className="hover:text-neutral-900 transition-colors text-[#A67C1E]">
                HERSTORY
              </Link>
            </nav>
          </div>

          {/* Right Section: Search Area, Location, Currency, Account, Wishlist, Bag */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Desktop Search Input */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Location indicator */}
            <div className="hidden md:flex items-center gap-1 text-[11px] text-neutral-600 pl-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-medium">Dhaka</span>
            </div>

            {/* Currency selector */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-700 cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as 'BDT' | 'USD')}
                className="bg-transparent text-neutral-700 text-[11px] font-medium cursor-pointer focus:outline-none border-none py-1"
                aria-label="Select Currency"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            {/* Account Link */}
            <Link
              href={currentUser ? '/account' : '/login'}
              className="p-1 sm:p-1.5 text-neutral-800 hover:text-amber-900 transition-colors flex items-center gap-2 group"
              title={currentUser ? `Signed in as ${currentUser.displayName} (${currentUser.email})` : 'Sign In'}
            >
              {currentUser?.photoURL ? (
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#A67C1E]/60 shrink-0 bg-neutral-100">
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    fill
                    className="object-cover"
                    sizes="28px"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : currentUser ? (
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-[#D4AF37] font-serif text-xs flex items-center justify-center font-semibold shrink-0 border border-[#A67C1E]/40">
                  {currentUser.displayName?.charAt(0) || 'P'}
                </div>
              ) : (
                <User className="w-5 h-5 stroke-[1.5]" />
              )}
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-800 group-hover:text-amber-900 leading-tight">
                  {currentUser ? currentUser.displayName?.split(' ')[0] : 'Sign In'}
                </span>
                {currentUser?.email && (
                  <span className="text-[9px] text-neutral-400 font-sans tracking-tight truncate max-w-[85px] leading-none">
                    {currentUser.email}
                  </span>
                )}
              </div>
            </Link>

            {/* Admin Panel Quick Link */}
            {(currentUser?.role === 'admin' || currentUser?.email === 'admin@ecobela.com' || currentUser?.isAdmin) && (
              <Link
                href="/admin"
                className="px-2.5 py-1 bg-neutral-900 text-amber-400 hover:bg-[#A67C1E] hover:text-white transition-all text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 rounded-xs"
                title="Admin Control Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-1.5 sm:p-2 text-neutral-800 hover:text-amber-900 transition-colors relative"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#121110] text-[#D4AF37] text-[10px] font-mono flex items-center justify-center font-medium">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={openCartDrawer}
              className="p-1.5 sm:p-2 text-neutral-800 hover:text-amber-900 transition-colors relative flex items-center gap-1.5 cursor-pointer"
              title="Shopping Bag"
              aria-label="Open shopping bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A67C1E] text-white text-[10px] font-mono flex items-center justify-center font-medium shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-medium uppercase tracking-wider text-neutral-700">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (toggleable) */}
        {isMobileSearchOpen && (
          <div className="p-3 border-t border-neutral-100 bg-neutral-50 lg:hidden">
            <SearchBar onClose={() => setIsMobileSearchOpen(false)} isMobileModal={true} />
          </div>
        )}

        {/* Second Desktop Navigation Row with Mega Menus */}
        <nav
          className="hidden lg:block border-t border-neutral-100 bg-white relative"
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ul className="flex items-center justify-center gap-3.5 xl:gap-5.5 2xl:gap-6 py-2.5">
              {navigationCategories.map((cat) => {
                const isActive = activeCategory?.id === cat.id;
                const isFestive = cat.id.includes('festive') || cat.id.includes('eid');
                const isWedding = cat.id === 'wedding';

                return (
                  <li
                    key={cat.id}
                    onMouseEnter={() => handleMouseEnter(cat)}
                    className="relative py-1 group/navitem shrink-0"
                  >
                    <Link
                      href={cat.href}
                      className={`text-[11px] xl:text-[11.5px] uppercase tracking-[0.12em] xl:tracking-[0.14em] font-medium transition-colors flex items-center gap-1 py-1 ${
                        isActive
                          ? 'text-amber-900 font-bold'
                          : isFestive
                          ? 'text-rose-800 hover:text-rose-950 font-semibold'
                          : isWedding
                          ? 'text-[#A67C1E] hover:text-amber-900 font-semibold'
                          : 'text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.hasMegaMenu && (
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-amber-900' : 'text-neutral-400 group-hover/navitem:text-neutral-700'
                          }`}
                        />
                      )}
                    </Link>

                    {/* Active hover underline indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-900 animate-in fade-in" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Reusable MegaMenu display */}
          {activeCategory && (
            <MegaMenu
              category={activeCategory}
              onClose={() => setActiveCategory(null)}
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </nav>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      <MobileNavbar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Shopping Bag Drawer */}
      <CartDrawer />
    </header>
  );
}
