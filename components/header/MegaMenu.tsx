'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { NavCategory } from '@/types/category';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  category: NavCategory;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({ category, onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  if (!category.columns || category.columns.length === 0) return null;

  const colCount = category.columns.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 2 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 w-full bg-white border-b border-neutral-200 shadow-xl z-50 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible hit bridge to prevent cursor gap closing when moving from nav */}
      <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent pointer-events-auto" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Main columns for categories and sub-items */}
          <div
            className={`${
              category.featuredBanner ? 'col-span-8 lg:col-span-9' : 'col-span-12'
            } grid divide-x divide-neutral-200`}
            style={{
              gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
            }}
          >
            {category.columns.map((column, colIdx) => (
              <div
                key={colIdx}
                className={`space-y-6 ${
                  colIdx === 0
                    ? 'pr-6'
                    : colIdx === colCount - 1
                    ? 'pl-6'
                    : 'px-6'
                }`}
              >
                {/* Single section column */}
                {column.items && (
                  <div className="space-y-3">
                    {column.title && column.title.trim().length > 0 && (
                      <h4 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-900 border-b border-neutral-200 pb-2 mb-2">
                        {column.title}
                      </h4>
                    )}
                    <ul className="space-y-2 text-xs">
                      {column.items.map((item, itemIdx) => {
                        const isAllUpper = item.name === item.name.toUpperCase() && item.name.length > 3;
                        return (
                          <li key={itemIdx} className="group/item">
                            <Link
                              href={`/${category.slug}/${item.slug}`}
                              onClick={onClose}
                              className={`block py-0.5 transition-all duration-150 ${
                                isAllUpper
                                  ? 'text-[11.5px] font-semibold tracking-wider text-neutral-800 hover:text-amber-800 hover:translate-x-0.5'
                                  : 'text-[12px] font-normal text-neutral-600 hover:text-neutral-950 hover:translate-x-0.5'
                              }`}
                            >
                              {item.name}
                            </Link>

                            {/* Sub-items if present */}
                            {item.subItems && item.subItems.length > 0 && (
                              <ul className="mt-1.5 pl-2.5 border-l border-neutral-200 space-y-1 my-1">
                                {item.subItems.map((sub, subIdx) => (
                                  <li key={subIdx}>
                                    <Link
                                      href={`/${category.slug}/${item.slug}?sub=${sub.slug}`}
                                      onClick={onClose}
                                      className="text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors block py-0.5"
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Multiple sections in one column (e.g. Occasions + Gifts By Price, or Brands) */}
                {column.sections &&
                  column.sections.map((section, secIdx) => (
                    <div key={secIdx} className="space-y-3">
                      <h4 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-900 border-b border-neutral-200 pb-2 mb-2">
                        {section.title}
                      </h4>
                      <ul className="space-y-2 text-xs">
                        {section.items.map((item, itemIdx) => {
                          const isAllUpper = item.name === item.name.toUpperCase() && item.name.length > 3;
                          return (
                            <li key={itemIdx} className="group/item">
                              <Link
                                href={`/${category.slug}/${item.slug}`}
                                onClick={onClose}
                                className={`block py-0.5 transition-all duration-150 ${
                                  isAllUpper
                                    ? 'text-[11.5px] font-semibold tracking-wider text-neutral-800 hover:text-amber-800 hover:translate-x-0.5'
                                    : 'text-[12px] font-normal text-neutral-600 hover:text-neutral-950 hover:translate-x-0.5'
                                }`}
                              >
                                {item.name}
                              </Link>
                              {item.subItems && item.subItems.length > 0 && (
                                <ul className="mt-1.5 pl-2.5 border-l border-neutral-200 space-y-1 my-1">
                                  {item.subItems.map((sub, subIdx) => (
                                    <li key={subIdx}>
                                      <Link
                                        href={`/${category.slug}/${item.slug}?sub=${sub.slug}`}
                                        onClick={onClose}
                                        className="text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors block py-0.5"
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Right side featured editorial banner */}
          {category.featuredBanner && (
            <div className="col-span-4 lg:col-span-3 pl-6 border-l border-neutral-200">
              <Link
                href={category.featuredBanner.link}
                onClick={onClose}
                className="group relative block h-full min-h-[300px] overflow-hidden bg-neutral-950 shadow-md"
              >
                <Image
                  src={category.featuredBanner.imageUrl}
                  alt={category.featuredBanner.title}
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700 ease-out"
                  sizes="(max-width: 1200px) 300px, 360px"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  {category.featuredBanner.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37] mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      {category.featuredBanner.badge}
                    </span>
                  )}
                  <h5 className="font-serif text-lg leading-snug tracking-wide group-hover:text-amber-200 transition-colors">
                    {category.featuredBanner.title}
                  </h5>
                  <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2 font-light">
                    {category.featuredBanner.subtitle}
                  </p>
                  <div className="mt-3.5 flex items-center gap-1.5 text-xs text-[#E5D7B7] uppercase tracking-wider font-medium group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
