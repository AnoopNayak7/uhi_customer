"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  onError?: () => void;
  fallbackSrc?: string;
  index?: number;
  lazy?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  sizes,
  onError,
  fallbackSrc,
  index,
  lazy = true,
  rootMargin = "50px",
  threshold = 0.1,
  ...props
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(priority || !lazy);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, shouldLoad, rootMargin, threshold]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Generate optimized blur placeholder
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.3"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e5e7eb"/>
            <stop offset="100%" style="stop-color:#d1d5db"/>
          </linearGradient>
        </defs>
      </svg>`
    )}`;
  };

  // Show placeholder while waiting to load
  if (!shouldLoad) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      >
        <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-300" />
        </div>
      </div>
    );
  }

  // Fallback component for failed images
  if (hasError) {
    if (fallbackSrc && fallbackSrc !== src) {
      return (
        <OptimizedImage
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={className}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          lazy={lazy}
          onError={() => setHasError(true)}
        />
      );
    }

    return (
      <div
        ref={imgRef}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center p-4">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            {index !== undefined
              ? `Property Image ${index + 1}`
              : "Image unavailable"}
          </p>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${
      isLoading ? "opacity-0" : "opacity-100"
    } transition-opacity duration-300`,
    onError: handleError,
    onLoad: handleLoad,
    quality,
    priority,
    placeholder:
      blurDataURL || placeholder === "blur"
        ? ("blur" as const)
        : ("empty" as const),
    blurDataURL:
      blurDataURL ||
      (placeholder === "blur" ? generateBlurDataURL(width, height) : undefined),
    sizes: sizes || (fill ? "100vw" : undefined),
    ...props,
  };

  return (
    <div ref={imgRef} className="relative">
      {fill ? (
        <Image {...imageProps} fill alt={alt || ""} />
      ) : (
        <Image
          {...imageProps}
          width={width || 400}
          height={height || 300}
          alt={alt || ""}
        />
      )}
    </div>
  );
};

// Predefined optimized image configurations for common use cases
export const PropertyImage = (
  props: Omit<OptimizedImageProps, "sizes" | "quality">
) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={85}
    placeholder="blur"
    lazy={true}
  />
);

export const HeroImage = (
  props: Omit<OptimizedImageProps, "sizes" | "quality" | "priority" | "lazy">
) => (
  <OptimizedImage
    {...props}
    sizes="100vw"
    quality={90}
    priority={true}
    lazy={false}
    placeholder="blur"
  />
);

export const ThumbnailImage = (
  props: Omit<OptimizedImageProps, "sizes" | "quality">
) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 25vw, 15vw"
    quality={75}
    placeholder="blur"
    lazy={true}
    rootMargin="100px"
  />
);

// New component for property gallery images with optimized lazy loading
export const PropertyGalleryImage = (
  props: Omit<OptimizedImageProps, "sizes" | "quality" | "lazy">
) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
    quality={90}
    placeholder="blur"
    lazy={true}
    rootMargin="200px"
  />
);

// Component for property list images with aggressive lazy loading
export const PropertyListImage = (
  props: Omit<OptimizedImageProps, "sizes" | "quality" | "lazy">
) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={80}
    placeholder="blur"
    lazy={true}
    rootMargin="50px"
  />
);
