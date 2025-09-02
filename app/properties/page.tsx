"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAuthStore, useSearchStore } from "@/lib/store";
import { Search, Navigation, Loader2, Grid3X3, MapIcon, Filter, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { FilterSection } from "@/components/propertyListing/FilterSection";
import { PropertyList } from "@/components/propertyListing/PropertyList";
import { MapView } from "@/components/propertyListing/MapView";
import { MobileFilterDrawer } from "@/components/propertyListing/MobileFilterDrawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function PropertiesPage() {
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [showLocalitySearch, setShowLocalitySearch] = useState(false);
  const [localitySearchQuery, setLocalitySearchQuery] = useState("");
  const [localitySuggestions, setLocalitySuggestions] = useState<any[]>([]);
  const [isSearchingLocalities, setIsSearchingLocalities] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [mapType, setMapType] = useState<"map" | "satellite">("map");

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};

      // Convert URL search params to API params
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          params[key] = value;
        }
      }

      if (!params.limit) params.limit = 20;
      if (!params.page) params.page = 1;

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
        
        setProperties(propertiesWithImages);
      } else {
        throw new Error("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [searchParams, setLoading]); // Added setLoading to dependency array

  useEffect(() => {
    // Update search filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      updateSearchFilters(params);
    }
    fetchProperties();
  }, [searchParams, updateSearchFilters, fetchProperties]);

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
          <div className="block lg:hidden mb-6 overflow-x-hidden">
            <div className="rounded-2xl shadow-lg border border-gray-100">
              {/* Search Bar with Search Button */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by location, landmark, project..."
                  className="pl-12 pr-4 py-4 w-full text-sm h-14 border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-red-200 rounded-xl transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />

                {/* Search Button beside search bar */}
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
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
          <div className="hidden lg:block mb-4 sm:mb-6">
            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <div className="relative flex-1 order-1 sm:order-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="text"
                    placeholder="Search by location, landmark, project..."
                    className="pl-10 pr-4 py-3 sm:py-2 w-full text-base sm:text-sm h-12 sm:h-auto"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
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

                <div className="flex gap-2 order-2 sm:order-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 h-12 sm:h-auto px-3 sm:px-4 text-sm sm:text-sm flex-1 sm:flex-none"
                    onClick={getUserLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    <span className="hidden xs:inline">Near Me</span>
                    <span className="xs:hidden">Near</span>
                  </Button>

                  <Button
                    onClick={handleSearch}
                    className="h-12 sm:h-auto px-4 sm:px-6 text-sm sm:text-sm flex-1 sm:flex-none"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-x-hidden">
            {/* Filter Section */}
            <FilterSection
              onSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0 overflow-x-hidden">
              {/* Mobile Filter Toggle */}
              <div className="block lg:hidden mb-4 overflow-x-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Properties
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {properties.length} properties found
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-10 px-4 border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-lg transition-all duration-300"
                    onClick={() => setMobileFilterOpen(true)}
                  >
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                    {(() => {
                      const activeFiltersCount = Object.values(searchFilters).filter(
                        (value) => value && value !== "" && value !== 0
                      ).length;
                      return activeFiltersCount > 0 ? (
                        <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {activeFiltersCount}
                        </div>
                      ) : null;
                    })()}
                  </Button>
                </div>
              </div>

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
              </div>

              {/* Desktop view - show grid or map based on viewMode */}
              <div className="hidden lg:block">
                {viewMode === "grid" ? (
                  <PropertyList
                    properties={properties}
                    loading={loading}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onFavorite={handleFavorite}
                  />
                ) : (
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm">
                          {
                            properties.filter((p) => p.latitude && p.longitude)
                              .length
                          }{" "}
                          properties on map
                        </p>
                      </div>
                    </div>

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

          {/* Mobile Filter Drawer - triggered by main Filters button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetContent 
              side="bottom" 
              className="h-[85vh] p-0 overflow-hidden mt-16"
            >
              <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
                {/* Enhanced Header with smooth animations */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shadow-sm">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-gray-900">Search Filters</h2>
                    <p className="text-sm text-gray-500">
                      {Object.values(searchFilters).filter((value) => value && value !== "" && value !== 0).length + selectedLocalities.length} filters applied
                    </p>
                  </div>
                 
                </div>

                {/* Enhanced Filter Content with smooth scrolling */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                  <div className="px-4 space-y-4 py-4">
                    {/* Select Localities with enhanced styling */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 text-red-500 mr-2" />
                        Select Localities
                      </h3>

                      {/* Enhanced Locality Search */}
                      {showLocalitySearch && (
                        <div className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search localities..."
                              value={localitySearchQuery}
                              onChange={(e) => setLocalitySearchQuery(e.target.value)}
                              onKeyDown={handleLocalitySearch}
                              className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-xl transition-all duration-300"
                            />
                            {isSearchingLocalities && (
                              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-red-500" />
                            )}
                          </div>

                          {/* Enhanced Suggestions */}
                          {localitySuggestions.length > 0 && (
                            <div className="mt-3 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                              {localitySuggestions.map((suggestion, index) => (
                                <div
                                  key={suggestion.place_id}
                                  className="px-4 py-3 hover:bg-red-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-all duration-200 group"

                                  onClick={() => handleLocalitySelect(suggestion)}
                                >
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-red-400 mr-3 group-hover:text-red-500 transition-colors duration-200" />
                                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{suggestion.display_name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced Selected Localities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedLocalities.map((locality, index) => (
                          <Badge
                            key={locality}
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm font-medium"
                          >
                            {locality}
                            <button
                              onClick={() => removeLocality(locality)}
                              className="ml-2 hover:bg-green-200 rounded-full p-1 transition-all duration-200 hover:scale-110"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      {/* Enhanced Add Locality Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLocalitySearch(!showLocalitySearch)}
                        className={`text-sm h-10 px-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          showLocalitySearch 
                            ? 'border-red-200 text-red-600 hover:bg-red-50 bg-red-50' 
                            : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {showLocalitySearch ? "Cancel" : "+ Add Locality"}
                      </Button>
                    </div>

                    {/* Enhanced Property Type */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Property Type</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["flat", "house", "villa", "plot"].map((type, index) => (
                          <div 
                            key={type} 
                            className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-gray-200"
                          >
                            <Checkbox
                              id={`mobile-type-${type}`}
                              checked={searchFilters.type === type}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange("type", type);
                                } else {
                                  handleFilterChange("type", "");
                                }
                              }}
                              className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 h-5 w-5"
                            />
                            <label htmlFor={`mobile-type-${type}`} className="ml-3 text-sm font-medium text-gray-700 capitalize cursor-pointer">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Property Category */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Property Category</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {PROPERTY_CATEGORIES.slice(0, 3).map((category, index) => (
                          <div
                            key={category.value}
                            className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                              searchFilters.propertyCategory === category.value
                                ? "border-red-500 bg-red-50 shadow-lg"
                                : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                            }`}

                            onClick={() =>
                              handleFilterChange("propertyCategory", 
                                searchFilters.propertyCategory === category.value ? "" : category.value
                              )
                            }
                          >
                            {searchFilters.propertyCategory === category.value && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                              </div>
                            )}
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {category.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Budget */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Budget Range</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          value={searchFilters.minPrice?.toString() || "0"}
                          onValueChange={(value) => handleFilterChange("minPrice", value)}
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-xl transition-all duration-300">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Min</SelectItem>
                            <SelectItem value="500000">5 Lac</SelectItem>
                            <SelectItem value="1000000">10 Lac</SelectItem>
                            <SelectItem value="2000000">20 Lac</SelectItem>
                            <SelectItem value="3000000">30 Lac</SelectItem>
                            <SelectItem value="5000000">50 Lac</SelectItem>
                            <SelectItem value="10000000">1 Cr</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={searchFilters.maxPrice?.toString() || "0"}
                          onValueChange={(value) => handleFilterChange("maxPrice", value)}
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-xl transition-all duration-300">
                            <SelectValue placeholder="Max" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Max</SelectItem>
                            <SelectItem value="1000000">10 Lac</SelectItem>
                            <SelectItem value="2000000">20 Lac</SelectItem>
                            <SelectItem value="3000000">30 Lac</SelectItem>
                            <SelectItem value="5000000">50 Lac</SelectItem>
                            <SelectItem value="10000000">1 Cr</SelectItem>
                            <SelectItem value="20000000">2 Cr</SelectItem>
                            <SelectItem value="50000000">5 Cr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Enhanced Covered Area */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Covered Area (sqft)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          value={searchFilters.minArea?.toString() || "0"}
                          onValueChange={(value) => handleFilterChange("minArea", value)}
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl transition-all duration-300">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Min</SelectItem>
                            <SelectItem value="500">500 sq.ft</SelectItem>
                            <SelectItem value="1000">1000 sq.ft</SelectItem>
                            <SelectItem value="1500">1500 sq.ft</SelectItem>
                            <SelectItem value="2000">2000 sq.ft</SelectItem>
                            <SelectItem value="2500">2500 sq.ft</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={searchFilters.maxArea?.toString() || "0"}
                          onValueChange={(value) => handleFilterChange("maxArea", value)}
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl transition-all duration-300">
                            <SelectValue placeholder="Max" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Max</SelectItem>
                            <SelectItem value="1000">1000 sq.ft</SelectItem>
                            <SelectItem value="2000">2000 sq.ft</SelectItem>
                            <SelectItem value="3000">3000 sq.ft</SelectItem>
                            <SelectItem value="5000">5000 sq.ft</SelectItem>
                            <SelectItem value="10000">10000 sq.ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Enhanced Bedrooms */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Bedrooms</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {BHK_OPTIONS.slice(0, 6).map((bhk, index) => (
                          <div 
                            key={bhk.value} 
                            className="flex items-center p-3 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-orange-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Checkbox
                              id={`mobile-bedroom-${bhk.value}`}
                              checked={searchFilters.bedrooms === bhk.value}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange("bedrooms", bhk.value);
                                } else {
                                  handleFilterChange("bedrooms", "");
                                }
                              }}
                              className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 h-5 w-5"
                            />
                            <label
                              htmlFor={`mobile-bedroom-${bhk.value}`}
                              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {bhk.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Furnishing Status */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Furnishing Status</h3>
                      <div className="space-y-3">
                        {FURNISHING_STATUS.map((status, index) => (
                          <div 
                            key={status.value} 
                            className="flex items-center p-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-indigo-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Checkbox
                              id={`mobile-furnishing-${status.value}`}
                              checked={searchFilters.furnishingStatus === status.value}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange("furnishingStatus", status.value);
                                } else {
                                  handleFilterChange("furnishingStatus", "");
                                }
                              }}
                              className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 h-5 w-5"
                            />
                            <label
                              htmlFor={`mobile-furnishing-${status.value}`}
                              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {status.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Possession Status */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Possession Status</h3>
                      <div className="space-y-3">
                        {POSSESSION_STATUS.map((status, index) => (
                          <div 
                            key={status.value} 
                            className="flex items-center p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Checkbox
                              id={`mobile-possession-${status.value}`}
                              checked={searchFilters.possessionStatus === status.value}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange("possessionStatus", status.value);
                                } else {
                                  handleFilterChange("possessionStatus", "");
                                }
                              }}
                              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-5 w-5"
                            />
                            <label
                              htmlFor={`mobile-possession-${status.value}`}
                              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {status.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <div className="p-6 border-t border-gray-100 bg-white shadow-lg">
                  <Button
                    onClick={() => {
                      // Update search filters with selected localities
                      if (selectedLocalities.length > 0) {
                        const area = selectedLocalities.join(",");
                        updateSearchFilters({ area });
                      }
                      handleSearch();
                      setMobileFilterOpen(false);
                    }}
                    className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
