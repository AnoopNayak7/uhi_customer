"use client";

import { useEffect } from 'react';

interface PreloadImageOptions {
  priority?: number;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Hook to preload critical images for better performance
 */
export const useImagePreloader = (images: string[], options: PreloadImageOptions = {}) => {
  const { priority = 0, fetchPriority = 'high' } = options;

  useEffect(() => {
    if (!images.length) return;

    const preloadImages = () => {
      images.forEach((src, index) => {
        // Create a link element for each image
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = fetchPriority;
        
        // Set priority based on index and provided priority
        if (index === 0 || priority > 0) {
          link.fetchPriority = 'high';
        }

        // Add to head
        document.head.appendChild(link);

        // Also create an Image object to start loading
        const img = new Image();
        img.src = src;
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 0);
    }
  }, [images, priority, fetchPriority]);
};

/**
 * Hook to preload property images based on viewport and user behavior
 */
export const usePropertyImagePreloader = (propertyImages: string[]) => {
  useEffect(() => {
    if (!propertyImages.length) return;

    // Preload first 3 images immediately
    const criticalImages = propertyImages.slice(0, 3);
    
    criticalImages.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = index === 0 ? 'high' : 'low';
      document.head.appendChild(link);
    });

    // Preload remaining images with lower priority
    const remainingImages = propertyImages.slice(3);
    if (remainingImages.length > 0) {
      setTimeout(() => {
        remainingImages.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      }, 1000); // Delay non-critical images
    }
  }, [propertyImages]);
};

/**
 * Hook to preload images when user hovers over property cards
 */
export const useHoverPreloader = () => {
  const preloadOnHover = (imageSrc: string) => {
    if (!imageSrc) return;

    // Check if image is already loaded/preloaded
    const existingLink = document.querySelector(`link[href="${imageSrc}"]`);
    if (existingLink) return;

    // Create preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageSrc;
    link.fetchPriority = 'low';
    document.head.appendChild(link);

    // Also start loading the image
    const img = new Image();
    img.src = imageSrc;
  };

  return { preloadOnHover };
};

/**
 * Hook to clean up preloaded image links
 */
export const useImagePreloadCleanup = () => {
  useEffect(() => {
    return () => {
      // Clean up preload links on unmount
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);
};
