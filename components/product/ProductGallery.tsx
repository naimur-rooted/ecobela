'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = () => {
    setSelectedIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail carousel / column */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[580px] shrink-0 pb-2 md:pb-0 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-26 shrink-0 bg-neutral-100 overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIdx === idx
                  ? 'border-neutral-900 opacity-100'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Preview Container */}
      <div
        className="relative flex-1 aspect-[3/4] bg-neutral-100 overflow-hidden group cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selectedIdx]}
          alt={`${productName} preview view ${selectedIdx + 1}`}
          fill
          priority
          className={`object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150 origin-center' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          referrerPolicy="no-referrer"
        />

        {/* Zoom Hint */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 backdrop-blur-xs flex items-center gap-1 opacity-80 group-hover:opacity-100 pointer-events-none transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hover to zoom details</span>
        </div>

        {/* Prev / Next controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full shadow-md backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Previous view"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full shadow-md backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Next view"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
