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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-3 sm:px-4 md:px-6 lg:px-[3%] py-4 sm:py-6 md:py-8">
        <PageContent>
          {/* Mobile Search Interface */}
          <div className="block lg:hidden mb-6">
            <div className="rounded-2xl shadow-lg border border-gray-100">
              {/* Search Bar with Search Button */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by location, landmark, project..."
                  className="pl-12 pr-4 py-4 w-full text-base h-14 border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-red-200 rounded-xl transition-all duration-300"
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

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Filter Section */}
            <FilterSection
              onSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Toggle */}
              <div className="block lg:hidden mb-4">
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
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <div className="bg-gray-100 rounded-md p-1 flex w-full sm:w-auto">
                        <Button
                          variant={"ghost"}
                          size="sm"
                          className="h-10 sm:h-8 px-3 sm:px-2 flex-1 sm:flex-none text-sm"
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid3X3 className="w-4 h-4 mr-1" />
                          <span className="hidden xs:inline">Grid</span>
                        </Button>
                        <Button
                          variant={viewMode === "map" ? "default" : "ghost"}
                          size="sm"
                          className="h-10 sm:h-8 px-3 sm:px-2 flex-1 sm:flex-none text-sm"
                          onClick={() => setViewMode("map")}
                        >
                          <MapIcon className="w-4 h-4 mr-1" />
                          <span className="hidden xs:inline">Map</span>
                        </Button>
                      </div>
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

          {/* Mobile Filter Drawer - triggered by main Filters button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetContent 
              side="bottom" 
              className="h-[90vh] p-0 overflow-hidden"
            >
              <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
                {/* Enhanced Header with smooth animations */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shadow-sm">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-gray-900">Search Filters</h2>
                    <p className="text-sm text-gray-500">
                      {Object.values(searchFilters).filter((value) => value && value !== "" && value !== 0).length} filters applied
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 p-0 rounded-full hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setMobileFilterOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                                {/* Enhanced Filter Content with smooth scrolling */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                  <div className="px-4 space-y-3 py-4">

                    {/* Enhanced Property Type */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Property Type</h3>
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

                    

                    {/* Enhanced Budget */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Budget Range</h3>
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
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Covered Area (sqft)</h3>
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
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Bedrooms</h3>
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
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Furnishing Status</h3>
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
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Possession Status</h3>
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
                <div className="p-4 border-t border-gray-100 bg-white shadow-lg">
                  <Button
                    onClick={() => {
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
