import { useState, useEffect } from 'react';
import { useLocationStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

export function useLocationData() {
  const { selectedLocation } = useLocationStore();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchLocationData = async () => {
    if (!selectedLocation?.city) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [featured, trending, top]:any = await Promise.all([
        apiClient.getFeaturedPropertiesByLocation(selectedLocation, 8),
        apiClient.getTrendingPropertiesByLocation(selectedLocation, 8),
        apiClient.getTopPropertiesByLocation(selectedLocation, 8)
      ]);

      if (featured.success) setFeaturedProperties(featured.data || []);
      if (trending.success) setTrendingProperties(trending.data || []);
      if (top.success) setTopProperties(top.data || []);
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Failed to fetch location-based data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, [selectedLocation]);

  const getLocationDisplay = () => {
    if (selectedLocation?.city) {
      if (selectedLocation.area) {
        return `${selectedLocation.area}, ${selectedLocation.city}`;
      }
      return selectedLocation.city;
    }
    return "Bangalore";
  };

  const getDefaultCity = () => selectedLocation?.city || 'Bengaluru';
  const getDefaultArea = () => selectedLocation?.area || '';

  return {
    selectedLocation,
    featuredProperties,
    trendingProperties,
    topProperties,
    loading,
    error,
    getLocationDisplay,
    getDefaultCity,
    getDefaultArea,
    refreshData: fetchLocationData
  };
}
