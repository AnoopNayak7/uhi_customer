"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useSearchStore } from "@/lib/store";
import { Search, Navigation, Loader2, Grid3X3, MapIcon } from "lucide-react";
import { toast } from "sonner";
import { FilterSection } from "@/components/propertyListing/FilterSection";
import { PropertyList } from "@/components/propertyListing/PropertyList";
import { MapView } from "@/components/propertyListing/MapView";

import { PageContent } from "@/components/animations/layout-wrapper";

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
  const { searchFilters, updateSearchFilters } = useSearchStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<any>("grid");
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [showFilters, setShowFilters] = useState(false);

  // Autocomplete states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Near me functionality
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Update search filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      updateSearchFilters(params);
    }
    fetchProperties();
  }, [searchParams]);

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchProperties = async () => {
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
        setProperties(response.data);
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
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-[3%] py-8">
        <PageContent>
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by location, landmark, project..."
                    className="pl-10 pr-4 py-2 w-full"
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

                <Button
                  variant="outline"
                  className="flex items-center gap-1"
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

                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Section */}
            <FilterSection
              onSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            {/* Main Content */}
            <div className="flex-1">
              {viewMode === "grid" ? (
                <PropertyList
                  properties={properties}
                  loading={loading}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              ) : (
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">Properties</h1>
                      <p className="text-gray-500 text-sm">
                        {
                          properties.filter((p) => p.latitude && p.longitude)
                            .length
                        }{" "}
                        properties on map
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-100 rounded-md p-1 flex">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid3X3 className="w-4 h-4 mr-1" />
                          Grid
                        </Button>
                        <Button
                          variant={viewMode === "map" ? "default" : "ghost"}
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => setViewMode("map")}
                        >
                          <MapIcon className="w-4 h-4 mr-1" />
                          Map
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
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
