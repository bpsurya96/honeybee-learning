'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  fallbackEmoji?: string;
  variant?: 'card' | 'hero' | 'thumbnail';
  className?: string;
}

export function ProductImage({
  src,
  alt,
  fallbackEmoji = '🍯',
  variant = 'card',
  className = ''
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  // Variant styling mapping
  const containerVariants = {
    card: "relative aspect-square w-full bg-amber-50 rounded-2xl overflow-hidden flex items-center justify-center border border-amber-100 shadow-sm",
    hero: "relative aspect-square w-full bg-amber-50 rounded-2xl overflow-hidden flex items-center justify-center border border-amber-100 shadow-md",
    thumbnail: "relative aspect-square w-full bg-amber-50 rounded-xl overflow-hidden flex items-center justify-center transition-colors"
  };

  const imageHoverClass = variant === 'card' 
    ? "object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-md" 
    : variant === 'thumbnail'
      ? "object-contain p-1"
      : "object-contain p-6 drop-shadow-xl";

  const sizesMap = {
    card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    hero: "(max-width: 768px) 100vw, 50vw",
    thumbnail: "96px"
  };

  const validSrc = src && !imageError;

  return (
    <div className={`${containerVariants[variant]} ${className}`}>
      {validSrc ? (
        <Image 
          src={src.startsWith('http') || src.startsWith('/') ? src : `/${src}`} 
          alt={alt}
          fill
          sizes={sizesMap[variant]}
          className={imageHoverClass}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`${variant === 'hero' ? 'text-9xl' : 'text-6xl'} group-hover:scale-110 transition-transform duration-300 drop-shadow-md`}>
          {fallbackEmoji}
        </span>
      )}
    </div>
  );
}
