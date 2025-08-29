"use client";

import { useState, useEffect, useRef } from "react";
import { OptimizedImage } from "./optimized-image";
import { BLUR_DATA_URLS } from "@/lib/images";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fallbackSrc?: string;
  index?: number;
  lowQualitySrc?: string;
  priority?: boolean;
}

/**
 * Progressive Image component that loads a low-quality version first
 * then transitions to the high-quality version for faster perceived loading
 */
export const ProgressiveImage = ({
  src,
  alt,
  lowQualitySrc,
  quality = 85,
  className = "",
  ...props
}: ProgressiveImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualityLoaded, setLowQualityLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate low quality version if not provided
  const getLowQualitySrc = (originalSrc: string) => {
    if (lowQualitySrc) return lowQualitySrc;

    // For Unsplash images, generate a low-quality version
    if (originalSrc.includes("unsplash.com")) {
      return originalSrc.replace(/q=\d+/, "q=20").replace(/w=\d+/, "w=50");
    }

    return originalSrc;
  };

  const lowQualityUrl = getLowQualitySrc(src);

  useEffect(() => {
    // Preload the low quality image
    const lowQualityImg = new Image();
    lowQualityImg.onload = () => setLowQualityLoaded(true);
    lowQualityImg.src = lowQualityUrl;

    // Preload the high quality image
    const highQualityImg = new Image();
    highQualityImg.onload = () => setImageLoaded(true);
    highQualityImg.src = src;
  }, [src, lowQualityUrl]);

  return (
    <div className="relative overflow-hidden">
      {/* Low quality placeholder */}
      {lowQualityLoaded && !imageLoaded && (
        <OptimizedImage
          src={lowQualityUrl}
          alt={alt}
          className={`${className} transition-opacity duration-300 absolute inset-0 filter blur-sm`}
          quality={20}
          lazy={false}
          {...props}
        />
      )}

      {/* High quality image */}
      <OptimizedImage
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        quality={quality}
        blurDataURL={BLUR_DATA_URLS.property}
        {...props}
      />
    </div>
  );
};

/**
 * Smart Image component that chooses the best loading strategy
 */
export const SmartImage = ({
  src,
  alt,
  priority = false,
  ...props
}: ProgressiveImageProps) => {
  // Use progressive loading for non-priority images
  if (!priority && src.includes("unsplash.com")) {
    return (
      <ProgressiveImage src={src} alt={alt} priority={priority} {...props} />
    );
  }

  // Use regular optimized image for priority images
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={priority}
      lazy={!priority}
      {...props}
    />
  );
};
