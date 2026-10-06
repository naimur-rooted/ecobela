
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FeaturedBanners() {
  return (
    <section className="w-full py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 2 Column Editorial Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">

          {/* ================= Banner 1 ================= */}
          <div className="group relative h-[420px] overflow-hidden bg-neutral-900 sm:h-[480px]">

            {/* Image */}
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80"
              alt="Royal Wedding Collection"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">

              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Bridal Trousseau & Haute Couture</span>
              </div>

              <h3 className="font-serif text-2xl font-normal leading-snug sm:text-3xl">
                The Royal Wedding Atelier
              </h3>

              <p className="mt-2 max-w-md text-xs font-light leading-relaxed text-neutral-300 sm:text-sm">
                Heirloom Mirpur Katans woven with pure gold zari,
                paired with bespoke Nawabi sherwanis crafted for
                life&apos;s grandest celebrations.
              </p>

              <div className="mt-5">
                <Link
                  href="/wedding"
                  className="inline-flex items-center gap-2 bg-white px-6 py-3 text-xs font-medium uppercase tracking-widest text-neutral-900 transition-all duration-300 hover:bg-[#D4AF37] hover:text-neutral-950"
                >
                  <span>Explore Bridal Atelier</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>

          {/* ================= Banner 2 ================= */}
          <div className="group relative h-[420px] overflow-hidden bg-neutral-900 sm:h-[480px]">

            {/* Image */}
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Artisanal Home Decor Collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">

              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Heritage Interiors</span>
              </div>

              <h3 className="font-serif text-2xl font-normal leading-snug sm:text-3xl">
                Artisanal Living &amp; Heirlooms
              </h3>

              <p className="mt-2 max-w-md text-xs font-light leading-relaxed text-neutral-300 sm:text-sm">
                Handcrafted quilts, traditional brass pieces,
                and wooden accents created to bring heritage
                into your home.
              </p>

              <div className="mt-5">
                <Link
                  href="/home-decor"
                  className="inline-flex items-center gap-2 bg-white px-6 py-3 text-xs font-medium uppercase tracking-widest text-neutral-900 transition-all duration-300 hover:bg-[#D4AF37] hover:text-neutral-950"
                >
                  <span>Discover Home Décor</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}