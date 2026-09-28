"use client";

import Image from "next/image";
import Link from "next/link";
import EmblaCarousel, { EmblaCarouselType } from "embla-carousel";
import { useState, useEffect, useRef, useCallback } from "react";
import { HeroSlide } from "@/data/hero-slides";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const emblaRef = useRef<EmblaCarouselType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPaused) emblaRef.current?.scrollNext();
    }, 5000);
  }, [isPaused]);

  useEffect(() => {
    if (!containerRef.current) return;
    const embla = EmblaCarousel(containerRef.current, {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    });
    emblaRef.current = embla;
    const onSelect = () => setSelectedIndex(embla.selectedScrollSnap() ?? 0);
    embla.on("select", onSelect);
    setSelectedIndex(embla.selectedScrollSnap() ?? 0);
    return () => {
      embla.destroy();
      emblaRef.current = null;
    };
  }, []);

  // Auto-play
  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isPaused, startAutoplay]);

  const scrollPrev = () => {
    emblaRef.current?.scrollPrev();
    startAutoplay();
  };
  const scrollNext = () => {
    emblaRef.current?.scrollNext();
    startAutoplay();
  };
  const scrollTo = (idx: number) => {
    emblaRef.current?.scrollTo(idx);
    startAutoplay();
  };

  const activeSlide = slides[selectedIndex] ?? slides[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-ink-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides viewport */}
      <div className="relative h-[72vh] min-h-[420px] max-h-[860px] w-full">
        <div ref={containerRef} className="h-full w-full overflow-hidden">
          <div className="flex h-full w-full">
            {slides.map((slide) => (
              <div key={slide.id} className="relative h-full w-full flex-shrink-0">
                <SlideImage slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/75 via-ink-900/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />

        {/* Content overlay — left-aligned Aarong style */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container-page">
            <div className="max-w-xl">
              {activeSlide.badge && (
                <span className="mb-4 inline-block rounded-full border border-brand-400/50 bg-brand-500/20 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-300 backdrop-blur-sm">
                  {activeSlide.badge}
                </span>
              )}
              <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                {activeSlide.title}
              </h1>
              <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
                {activeSlide.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={activeSlide.ctaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-maroon-800 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-maroon-700 active:scale-[0.98]"
                >
                  {activeSlide.cta}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Explore All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={scrollNext}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideImage({ slide }: { slide: HeroSlide }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={slide.imageUrl}
        alt={`${slide.title} — Eco Bela`}
        fill
        priority
        className="object-cover object-center"
        onError={(e) => {
          e.currentTarget.src = slide.fallbackUrl;
        }}
      />
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
