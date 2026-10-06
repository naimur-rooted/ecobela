'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export function PromotionalBanner() {
  return (
    <section className="relative my-16 bg-[#161412] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENUINE GI CERTIFIED CRAFT</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-white">
            Weaving Stories Across Five Hundred Years
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Along the quiet banks of the Shitalakshya in Sonargaon, our master weavers practice an art form recognized by UNESCO as an Intangible Cultural Heritage of Humanity. Every motif in our Jamdani sarees is woven directly on the loom from memory, using unspun bamboo shuttles and 100-count combed cotton.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-neutral-800 text-xs">
            <div>
              <span className="font-serif text-2xl sm:text-3xl text-[#D4AF37] block">45+</span>
              <span className="text-neutral-400 mt-1 block">Days to weave each Jamdani masterpiece</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl text-[#D4AF37] block">240+</span>
              <span className="text-neutral-400 mt-1 block">Generational artisan families empowered</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl text-[#D4AF37] block">100%</span>
              <span className="text-neutral-400 mt-1 block">Authentic natural fibers & eco dyes</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/special-collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-neutral-950 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
            >
              <span>Our Artisanal Manifesto</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Editorial visual */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-neutral-800 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
              alt="Master weaver working at the Sonargaon loom"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-xs text-xs text-neutral-300 border border-white/10">
              <span className="text-[#D4AF37] font-semibold block uppercase tracking-wider text-[10px]">
                Sonargaon Weaving Cluster
              </span>
              Handloom pit loom technique passed down through 5 generations.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
