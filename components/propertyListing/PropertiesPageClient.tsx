"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAuthStore, useSearchStore } from "@/lib/store";
import { trackPropertySearch, trackUserInteraction } from "@/components/analytics/GoogleAnalytics";
import { Search, Navigation, Loader2, Grid3X3, MapIcon, Filter, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { FilterSection } from "@/components/propertyListing/FilterSection";
import { PropertyList } from "@/components/propertyListing/PropertyList";
import { MapView } from "@/components/propertyListing/MapView";

import { PageContent } from "@/components/animations/layout-wrapper";
import { PROPERTY_CATEGORIES, BHK_OPTIONS, FURNISHING_STATUS, POSSESSION_STATUS } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

// Location suggestion interface
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

export function PropertiesPageClient() {
  const searchParams: any = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { searchFilters, updateSearchFilters } = useSearchStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [showLocalitySearch, setShowLocalitySearch] = useState(false);
  const [localitySearchQuery, setLocalitySearchQuery] = useState("");
  const [localitySuggestions, setLocalitySuggestions] = useState<any[]>([]);
  const [isSearchingLocalities, setIsSearchingLocalities] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchProperties = useCallback(async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const params: any = {};

      // Convert URL search params to API params
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          params[key] = value;
        }
      }

      params.limit = 9; // Load 9 properties at a time
      params.page = page;

      const response: any = await apiClient.getProperties(params);

      if (response.success && response.data) {
        console.log('Properties API response:', response);
        console.log('Properties data:', response.data);
        console.log('First property sample:', response.data[0]);
        
        // Ensure all properties have images
        const propertiesWithImages = response.data.map((property: any) => {
          if (!property.images || property.images.length === 0) {
            // Add default images if none exist - using more reliable URLs
            property.images = [
              'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Property+Image',
              'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Property+Image',
              'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Property+Image'
            ];
            console.log(`Added default images to property ${property.id}:`, property.images);
          } else {
            console.log(`Property ${property.id} already has images:`, property.images);
          }
          return property;
        });
        
        if (append) {
          setProperties(prev => [...prev, ...propertiesWithImages]);
        } else {
          setProperties(propertiesWithImages);
        }
        
        // Check if there are more pages
        const totalPages = response.pagination?.totalPages || 1;
        setHasMore(page < totalPages);
        setCurrentPage(page);
      } else {
        throw new Error("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      if (!append) {
        setProperties([]);
      }
      toast.error("Failed to load properties");
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Update search filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      updateSearchFilters(params);
    }
    // Reset pagination when search params change
    setCurrentPage(1);
    setHasMore(true);
    fetchProperties(1, false);
  }, [searchParams, updateSearchFilters, fetchProperties]);

  // Infinite scroll effect
  useEffect(() => {
    const loadMore = () => {
      if (hasMore && !loadingMore && !loading) {
        fetchProperties(currentPage + 1, true);
      }
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, currentPage, fetchProperties]);

  const handleFilterChange = (key: string, value: string) => {
    // Handle special "all" values by converting them to empty strings
    const actualValue =
      value === "all-cities" ||
      value === "all-types" ||
      value === "all-categories"
        ? ""
        : value;
    updateSearchFilters({ [key]: actualValue });

    const params = new URLSearchParams(searchParams.toString());
    if (actualValue) {
      params.set(key, actualValue);
    } else {
      params.delete(key);
    }

    // Navigate to new URL with updated params
    router.push(`/properties?${params.toString()}`);
  };

  // Search localities function
  const searchLocalities = async (query: string) => {
    if (!query.trim()) {
      setLocalitySuggestions([]);
      return;
    }

    setIsSearchingLocalities(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in&limit=10`
      );
      const data = await response.json();
      setLocalitySuggestions(data);
    } catch (error) {
      console.error("Error searching localities:", error);
    } finally {
      setIsSearchingLocalities(false);
    }
  };

  const handleLocalitySearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchLocalities(localitySearchQuery);
    }
  };

  const handleLocalitySelect = (suggestion: any) => {
    const localityName = suggestion.display_name.split(",")[0].trim();
    if (!selectedLocalities.includes(localityName)) {
      setSelectedLocalities((prev) => [...prev, localityName]);
    }
    setLocalitySearchQuery("");
    setLocalitySuggestions([]);
    setShowLocalitySearch(false);
  };

  const removeLocality = (locality: string) => {
    setSelectedLocalities((prev) => prev.filter((l) => l !== locality));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add all current search filters to params
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        params.append(key, value.toString());
      }
    });

    // Track search event
    trackPropertySearch(searchQuery || "property_search", searchFilters);

    router.push(`/properties?${params.toString()}`);
  };

  // Search locations function
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error searching locations:", error);
      toast.error("Failed to search locations");
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);

    // Update area filter
    const locationParts = suggestion.display_name.split(",");
    const area = locationParts[0].trim();
    updateSearchFilters({ area });

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("area", area);
    router.push(`/properties?${params.toString()}`);
  };

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsGettingLocation(false);
        toast.success("Location found");

        // If in map view, center the map on user location
        if (viewMode === "map") {
          // The map component will automatically center on the new userLocation
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location");
        setIsGettingLocation(false);
      }
    );
  };

  const handleFavorite = async (property: any) => {
    if (!user) {
      toast.error('Please login to add favourites');
      return;
    }

    try {
      const isFavorite = property.isFavourite;
      if (isFavorite) {
        await apiClient.removeFromFavourites(property.id);
        toast.success('Property removed from favourites');
      } else {
        await apiClient.addToFavourites(property.id);
        toast.success('Property added to favourites');
      }
      // Update the property's favourite status
      setProperties(prev => prev.map(p => 
        p.id === property.id 
          ? { ...p, isFavourite: !isFavorite }
          : p
      ));
    } catch (error) {
      console.error('Error updating favourite:', error);
      toast.error('Failed to update favourite');
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1 container mx-auto px-3 sm:px-4 md:px-6 lg:px-[3%] py-4 sm:py-6 md:py-8 max-w-full">
        <PageContent className="overflow-x-hidden">
          {/* Mobile Search Interface */}
          <div className="block lg:hidden mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              {/* Search Bar with Search Button */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by location, landmark, project..."
                  className="pl-10 pr-20 py-3 w-full text-sm h-12 border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  style={{ fontSize: '16px' }} // Prevent zoom on mobile
                />

                {/* Search Button beside search bar */}
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300"
                >
                  <Search className="w-4 h-4" />
                </Button>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="px-4 py-3 hover:bg-red-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                          <span className="text-gray-700">{suggestion.display_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Near Me Button - Hidden on mobile */}
              <div className="hidden">
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 font-medium rounded-xl transition-all duration-300"
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Navigation className="h-4 w-4 mr-2" />
                  )}
                  Near Me
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Search bar */}
          <div className="hidden lg:block mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by location, landmark, project..."
                    className="pl-10 pr-4 py-3 w-full text-sm h-12 border border-gray-200 focus:ring-2 focus:ring-red-200 rounded-lg"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    style={{ fontSize: '16px' }} // Prevent zoom on mobile
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.place_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.display_name}
                        </div>
                      ))}
                    </div>
                  )}

                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="animate-spin h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12 px-4 text-sm border-gray-200 hover:border-red-300 hover:bg-red-50"
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  Near Me
                </Button>

                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                    Search
                  </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-x-hidden h-[calc(100vh-200px)]">
            {/* Filter Section */}
            <FilterSection
              onSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              propertiesCount={properties.length}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0 overflow-x-hidden flex flex-col">

              {/* Desktop Properties Count and View Toggle */}
              <div className="hidden lg:block mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Properties
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {properties.length} properties found
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 rounded-md p-1 flex">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-2 text-sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="w-4 h-4 mr-1" />
                        Grid
                      </Button>
                      <Button
                        variant={viewMode === "map" ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-2 text-sm"
                        onClick={() => setViewMode("map")}
                      >
                        <MapIcon className="w-4 h-4 mr-1" />
                        Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile view - always show grid */}
              <div className="block lg:hidden">
                <PropertyList
                  properties={properties}
                  loading={loading}
                  viewMode="grid"
                  setViewMode={setViewMode}
                  onFavorite={handleFavorite}
                />
                {/* Infinite scroll trigger for mobile */}
                <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                  {loadingMore && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">Loading more properties...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop view - show grid or map based on viewMode */}
              <div className="hidden lg:block flex-1 overflow-hidden">
                {viewMode === "grid" ? (
                  <div className="h-full overflow-y-auto">
                    <PropertyList
                      properties={properties}
                      loading={loading}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      onFavorite={handleFavorite}
                    />
                    {/* Infinite scroll trigger for desktop */}
                    <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                      {loadingMore && (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">Loading more properties...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <MapView
                      properties={properties}
                      userLocation={userLocation}
                      mapType={mapType}
                      setMapType={setMapType}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContent>
      </main>
    </div>
  );
}
