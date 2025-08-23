// Production-ready image configurations and constants
// Centralized image management for better performance and maintainability

// Optimized Unsplash URLs with proper parameters for production
export const PROPERTY_IMAGES = {
  // High-quality property images with optimized parameters
  luxury_home_1: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  luxury_home_2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  modern_apartment_1: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  modern_apartment_2: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  villa_1: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  villa_2: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  penthouse_1: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  penthouse_2: "https://images.unsplash.com/photo-1616137148922-d8e78b6bb4c0?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  commercial_1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  
  // Default fallback image
  default: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
};

// Thumbnail versions for better performance
export const PROPERTY_THUMBNAILS = {
  luxury_home_1: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  luxury_home_2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  modern_apartment_1: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  modern_apartment_2: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  villa_1: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  villa_2: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  penthouse_1: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  penthouse_2: "https://images.unsplash.com/photo-1616137148922-d8e78b6bb4c0?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  commercial_1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
  
  // Default fallback thumbnail
  default: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center&auto=format&q=75",
};

// Hero section images
export const HERO_IMAGES = {
  main_hero: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=1200&h=800&fit=crop&crop=center&auto=format&q=85",
  cta_luxury: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800&h=600&fit=crop&crop=center&auto=format&q=85",
};

// Property type collections for variety
export const PROPERTY_COLLECTIONS = {
  apartments: [
    PROPERTY_IMAGES.modern_apartment_1,
    PROPERTY_IMAGES.modern_apartment_2,
    PROPERTY_IMAGES.penthouse_1,
    PROPERTY_IMAGES.penthouse_2,
  ],
  houses: [
    PROPERTY_IMAGES.luxury_home_1,
    PROPERTY_IMAGES.luxury_home_2,
    PROPERTY_IMAGES.villa_1,
    PROPERTY_IMAGES.villa_2,
  ],
  commercial: [
    PROPERTY_IMAGES.commercial_1,
  ],
  all: Object.values(PROPERTY_IMAGES).filter(img => img !== PROPERTY_IMAGES.default),
};

// Helper function to get random property images
export const getRandomPropertyImages = (count: number = 5, type?: keyof typeof PROPERTY_COLLECTIONS) => {
  const collection = type ? PROPERTY_COLLECTIONS[type] : PROPERTY_COLLECTIONS.all;
  const shuffled = [...collection].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get optimized image URL with custom parameters
export const getOptimizedImageUrl = (
  baseUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    fit?: 'crop' | 'fill' | 'scale';
    crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  } = {}
) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'auto',
    fit = 'crop',
    crop = 'center'
  } = options;

  const url = new URL(baseUrl);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('h', height.toString());
  url.searchParams.set('q', quality.toString());
  url.searchParams.set('auto', format);
  url.searchParams.set('fit', fit);
  url.searchParams.set('crop', crop);

  return url.toString();
};

// Blur data URLs for better loading experience
export const BLUR_DATA_URLS = {
  property: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiIG9wYWNpdHk9IjAuMyIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlNWU3ZWIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkMWQ1ZGIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=",
  hero: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZGllbnQpIiBvcGFjaXR5PSIwLjMiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTVlN2ViIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZDFkNWRiIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+",
  thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+",
};
