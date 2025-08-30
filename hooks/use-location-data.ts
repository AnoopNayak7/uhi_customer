import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocationStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

// Global cache to prevent multiple API calls for the same data
const dataCache = new Map<string, {
  featuredProperties: any[];
  trendingProperties: any[];
  topProperties: any[];
  timestamp: number;
  loading: boolean;
}>();

// Cache expiry time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Singleton for managing API calls
class LocationDataManager {
  private static instance: LocationDataManager;
  private ongoingRequests = new Map<string, Promise<any>>();

  static getInstance(): LocationDataManager {
    if (!LocationDataManager.instance) {
      LocationDataManager.instance = new LocationDataManager();
    }
    return LocationDataManager.instance;
  }

  async fetchLocationData(city: string) {
    const cacheKey = city;
    
    console.log(`🔍 LocationDataManager: Fetching data for city: ${city}`);
    
    // Check if we have valid cached data
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY && !cached.loading) {
      console.log(`✅ LocationDataManager: Using cached data for ${city}`);
      return cached;
    }

    // Check if there's an ongoing request for this city
    if (this.ongoingRequests.has(cacheKey)) {
      console.log(`⏳ LocationDataManager: Reusing ongoing request for ${city}`);
      return this.ongoingRequests.get(cacheKey);
    }

    console.log(`🚀 LocationDataManager: Starting new request for ${city}`);

    // Create new request
    const requestPromise = this.performFetch(cacheKey, city);
    this.ongoingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.ongoingRequests.delete(cacheKey);
    }
  }

  private async performFetch(cacheKey: string, city: string) {
    console.log(`📡 LocationDataManager: Making API calls for ${city}`);
    
    // Set loading state in cache
    dataCache.set(cacheKey, {
      featuredProperties: [],
      trendingProperties: [],
      topProperties: [],
      timestamp: Date.now(),
      loading: true
    });

    try {
      const locationData = { city, area: undefined };
      
      const [featured, trending, top]: any = await Promise.all([
        apiClient.getFeaturedPropertiesByLocation(locationData, 8),
        apiClient.getTrendingPropertiesByLocation(locationData, 8),
        apiClient.getTopPropertiesByLocation(locationData, 8)
      ]);

      const result = {
        featuredProperties: featured.success ? featured.data || [] : [],
        trendingProperties: trending.success ? trending.data || [] : [],
        topProperties: top.success ? top.data || [] : [],
        timestamp: Date.now(),
        loading: false
      };

      // Ensure all properties have images
      const ensurePropertiesHaveImages = (properties: any[]) => {
        return properties.map((property: any) => {
          if (!property.images || property.images.length === 0) {
            // Add default images if none exist
            property.images = [
              'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Property+Image',
              'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Property+Image',
              'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Property+Image'
            ];
            console.log(`Added default images to property ${property.id} in location data`);
          }
          return property;
        });
      };

      // Apply image fallback to all property arrays
      result.featuredProperties = ensurePropertiesHaveImages(result.featuredProperties);
      result.trendingProperties = ensurePropertiesHaveImages(result.trendingProperties);
      result.topProperties = ensurePropertiesHaveImages(result.topProperties);

      console.log(`✅ LocationDataManager: Successfully fetched data for ${city}`);

      // Update cache
      dataCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('❌ LocationDataManager: Error fetching location data:', error);
      
      // Update cache with error state
      dataCache.set(cacheKey, {
        featuredProperties: [],
        trendingProperties: [],
        topProperties: [],
        timestamp: Date.now(),
        loading: false
      });
      
      throw error;
    }
  }

  clearCache(city?: string) {
    if (city) {
      dataCache.delete(city);
      console.log(`🗑️ LocationDataManager: Cleared cache for ${city}`);
    } else {
      dataCache.clear();
      console.log(`🗑️ LocationDataManager: Cleared all cache`);
    }
  }
}

export function useLocationData() {
  const { selectedLocation } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState({
    featuredProperties: [],
    trendingProperties: [],
    topProperties: []
  });
  
  const dataManager = useMemo(() => LocationDataManager.getInstance(), []);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLocationData = useCallback(async (city: string) => {
    console.log(`🔄 useLocationData: fetchLocationData called for ${city}`);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataManager.fetchLocationData(city);
      
      // Check if request was cancelled
      if (abortControllerRef.current.signal.aborted) {
        console.log(`🚫 useLocationData: Request cancelled for ${city}`);
        return;
      }

      setData({
        featuredProperties: result.featuredProperties,
        trendingProperties: result.trendingProperties,
        topProperties: result.topProperties
      });
      
      console.log(`✅ useLocationData: Data updated for ${city}`);
    } catch (err: any) {
      // Don't set error if request was cancelled
      if (err.name === 'AbortError') {
        console.log(`🚫 useLocationData: Request aborted for ${city}`);
        return;
      }
      console.error('❌ useLocationData: Error fetching location data:', err);
      setError('Failed to fetch location-based data');
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [dataManager]);

  useEffect(() => {
    const city = selectedLocation?.city || 'Bengaluru';
    console.log(`📍 useLocationData: useEffect triggered for city: ${city}`);
    fetchLocationData(city);

    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedLocation?.city, fetchLocationData]);

  const getLocationDisplay = () => {
    if (selectedLocation?.city) {
      if (selectedLocation.area) {
        return `${selectedLocation.area}, ${selectedLocation.city}`;
      }
      return selectedLocation.city;
    }
    return "Bengaluru";
  };

  const getDefaultCity = () => selectedLocation?.city || 'Bengaluru';
  const getDefaultArea = () => selectedLocation?.area || '';

  const refreshData = useCallback(() => {
    const city = selectedLocation?.city || 'Bengaluru';
    console.log(`🔄 useLocationData: refreshData called for ${city}`);
    // Clear cache for this city to force fresh data
    dataManager.clearCache(city);
    fetchLocationData(city);
  }, [selectedLocation?.city, fetchLocationData, dataManager]);

  return {
    selectedLocation,
    featuredProperties: data.featuredProperties,
    trendingProperties: data.trendingProperties,
    topProperties: data.topProperties,
    loading,
    error,
    getLocationDisplay,
    getDefaultCity,
    getDefaultArea,
    refreshData
  };
}
