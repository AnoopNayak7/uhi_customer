"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, ArrowLeft, X, Loader2 } from "lucide-react";
import { PROPERTY_CATEGORIES, BHK_OPTIONS, FURNISHING_STATUS, POSSESSION_STATUS } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useSearchStore, useAuthStore } from "@/lib/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api";

interface MobileSearchProps {
  onClose: () => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

export function MobileSearch({ onClose }: MobileSearchProps) {
  const router = useRouter();
  const { updateSearchFilters } = useSearchStore();
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Buy");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [showLocalitySearch, setShowLocalitySearch] = useState(false);
  const [localitySearchQuery, setLocalitySearchQuery] = useState("");
  const [localitySuggestions, setLocalitySuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingLocalities, setIsSearchingLocalities] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "0",
    maxPrice: "0",
    propertyCategory: "",
    bedrooms: "",
    furnishingStatus: "",
    possessionStatus: "",
    minArea: "0",
    maxArea: "0",
  });

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
    if (e.key === 'Enter') {
      searchLocalities(localitySearchQuery);
    }
  };

  const handleLocalitySelect = (suggestion: LocationSuggestion) => {
    const localityName = suggestion.display_name.split(',')[0].trim();
    if (!selectedLocalities.includes(localityName)) {
      setSelectedLocalities(prev => [...prev, localityName]);
    }
    setLocalitySearchQuery("");
    setLocalitySuggestions([]);
    setShowLocalitySearch(false);
  };

  const removeLocality = (locality: string) => {
    setSelectedLocalities(prev => prev.filter(l => l !== locality));
  };

  const saveUserSearchPreferences = async (searchData: any) => {
    if (!user || !token) return;

    try {
      await apiClient.saveUserSearchPreferences({
        userId: user.id,
        searchPreferences: searchData,
        lastSearchedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving search preferences:', error);
    }
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    
    // Add localities as area
    if (selectedLocalities.length > 0) {
      params.append("area", selectedLocalities.join(','));
    }
    
    // Add property type based on active tab
    if (activeTab === "Buy") {
      params.append("type", "sell");
    } else if (activeTab === "Rent") {
      params.append("type", "rent");
    } else if (activeTab === "Plot") {
      params.append("propertyCategory", "plot");
    } else if (activeTab === "Commercial") {
      params.append("propertyCategory", "office");
    }
    
    // Add filters (excluding "0" values which represent "no selection")
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "0") {
        params.append(key, value);
      }
    });

    // Prepare search data for preferences
    const searchData = {
      type: activeTab === "Buy" ? "sell" : activeTab === "Rent" ? "rent" : "",
      localities: selectedLocalities,
      minPrice: filters.minPrice && filters.minPrice !== "0" ? parseInt(filters.minPrice) : 0,
      maxPrice: filters.maxPrice && filters.maxPrice !== "0" ? parseInt(filters.maxPrice) : 100000000,
      bedrooms: filters.bedrooms,
      propertyCategory: filters.propertyCategory,
      furnishingStatus: filters.furnishingStatus,
      possessionStatus: filters.possessionStatus,
      minArea: filters.minArea && filters.minArea !== "0" ? parseInt(filters.minArea) : 0,
      maxArea: filters.maxArea && filters.maxArea !== "0" ? parseInt(filters.maxArea) : 0,
    };

    // Update search store
    updateSearchFilters({
      type: searchData.type,
      city: "",
      area: selectedLocalities.join(','),
      minPrice: searchData.minPrice,
      maxPrice: searchData.maxPrice,
      bedrooms: searchData.bedrooms,
      propertyCategory: searchData.propertyCategory,
      furnishingStatus: searchData.furnishingStatus,
      possessionStatus: searchData.possessionStatus,
    });

    // Save user preferences if logged in
    await saveUserSearchPreferences(searchData);

    router.push(`/properties?${params.toString()}`);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      minPrice: "0",
      maxPrice: "0",
      propertyCategory: "",
      bedrooms: "",
      furnishingStatus: "",
      possessionStatus: "",
      minArea: "0",
      maxArea: "0",
    });
    setSelectedLocalities([]);
  };

  const getActiveFilterCount = () => {
    const filterCount = Object.values(filters).filter(value => value !== "" && value !== "0").length;
    return filterCount + selectedLocalities.length;
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <button onClick={onClose} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Filters ({getActiveFilterCount()})</h1>
        <button onClick={resetFilters} className="text-red-500 text-sm font-medium">
          Reset
        </button>
      </div>


      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filter Sections */}
        <div className="px-4 space-y-6 py-4">
          {/* Select Localities */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Select Localities</h3>
            
            {/* Locality Search */}
            {showLocalitySearch && (
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search localities..."
                    value={localitySearchQuery}
                    onChange={(e) => setLocalitySearchQuery(e.target.value)}
                    onKeyDown={handleLocalitySearch}
                    className="pl-10 pr-10"
                  />
                  {isSearchingLocalities && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                
                {/* Suggestions */}
                {localitySuggestions.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {localitySuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={() => handleLocalitySelect(suggestion)}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Localities */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedLocalities.map((locality) => (
                <Badge key={locality} variant="secondary" className="bg-green-100 text-green-800">
                  {locality}
                  <button
                    onClick={() => removeLocality(locality)}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add Locality Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLocalitySearch(!showLocalitySearch)}
              className="text-sm"
            >
              {showLocalitySearch ? "Cancel" : "+ Add Locality"}
            </Button>
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Budget</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.minPrice}
                onValueChange={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
              >
                <SelectTrigger className="h-10">
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
                value={filters.maxPrice}
                onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
              >
                <SelectTrigger className="h-10">
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

          {/* Property Category */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Property Category</h3>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_CATEGORIES.slice(0, 3).map((category) => (
                <div
                  key={category.value}
                  className={`relative border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    filters.propertyCategory === category.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    propertyCategory: prev.propertyCategory === category.value ? "" : category.value 
                  }))}
                >
                  {filters.propertyCategory === category.value && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium">{category.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Covered Area */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              Covered Area (sqft)
              <span className="ml-1 text-gray-400">ⓘ</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.minArea}
                onValueChange={(value) => setFilters(prev => ({ ...prev, minArea: value }))}
              >
                <SelectTrigger className="h-10">
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
                value={filters.maxArea}
                onValueChange={(value) => setFilters(prev => ({ ...prev, maxArea: value }))}
              >
                <SelectTrigger className="h-10">
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

          {/* Bedrooms */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Bedrooms</h3>
            <div className="grid grid-cols-2 gap-3">
              {BHK_OPTIONS.slice(0, 6).map((bhk) => (
                <div key={bhk.value} className="flex items-center">
                  <Checkbox
                    id={`mobile-bedroom-${bhk.value}`}
                    checked={filters.bedrooms === bhk.value}
                    onCheckedChange={(checked) => {
                      setFilters(prev => ({ 
                        ...prev, 
                        bedrooms: checked ? bhk.value : "" 
                      }));
                    }}
                  />
                  <label
                    htmlFor={`mobile-bedroom-${bhk.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {bhk.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Furnishing Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Furnishing Status</h3>
            <div className="space-y-2">
              {FURNISHING_STATUS.map((status) => (
                <div key={status.value} className="flex items-center">
                  <Checkbox
                    id={`mobile-furnishing-${status.value}`}
                    checked={filters.furnishingStatus === status.value}
                    onCheckedChange={(checked) => {
                      setFilters(prev => ({ 
                        ...prev, 
                        furnishingStatus: checked ? status.value : "" 
                      }));
                    }}
                  />
                  <label
                    htmlFor={`mobile-furnishing-${status.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Possession Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Possession Status</h3>
            <div className="space-y-2">
              {POSSESSION_STATUS.map((status) => (
                <div key={status.value} className="flex items-center">
                  <Checkbox
                    id={`mobile-possession-${status.value}`}
                    checked={filters.possessionStatus === status.value}
                    onCheckedChange={(checked) => {
                      setFilters(prev => ({ 
                        ...prev, 
                        possessionStatus: checked ? status.value : "" 
                      }));
                    }}
                  />
                  <label
                    htmlFor={`mobile-possession-${status.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <Button
          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
          onClick={handleSearch}
        >
          View Properties
        </Button>
      </div>
    </div>
  );
}
