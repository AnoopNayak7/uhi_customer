"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, ArrowLeft, X, Loader2 } from "lucide-react";
import {
  PROPERTY_CATEGORIES,
  BHK_OPTIONS,
  FURNISHING_STATUS,
  POSSESSION_STATUS,
} from "@/lib/config";
import { useRouter } from "next/navigation";
import { useSearchStore, useAuthStore } from "@/lib/store";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [localitySuggestions, setLocalitySuggestions] = useState<
    LocationSuggestion[]
  >([]);
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
    if (e.key === "Enter") {
      searchLocalities(localitySearchQuery);
    }
  };

  const handleLocalitySelect = (suggestion: LocationSuggestion) => {
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

  const saveUserSearchPreferences = async (searchData: any) => {
    if (!user || !token) return;

    try {
      await apiClient.saveUserSearchPreferences({
        userId: user.id,
        searchPreferences: searchData,
        lastSearchedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving search preferences:", error);
    }
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();

    // Add localities as area
    if (selectedLocalities.length > 0) {
      params.append("area", selectedLocalities.join(","));
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
      minPrice:
        filters.minPrice && filters.minPrice !== "0"
          ? parseInt(filters.minPrice)
          : 0,
      maxPrice:
        filters.maxPrice && filters.maxPrice !== "0"
          ? parseInt(filters.maxPrice)
          : 100000000,
      bedrooms: filters.bedrooms,
      propertyCategory: filters.propertyCategory,
      furnishingStatus: filters.furnishingStatus,
      possessionStatus: filters.possessionStatus,
      minArea:
        filters.minArea && filters.minArea !== "0"
          ? parseInt(filters.minArea)
          : 0,
      maxArea:
        filters.maxArea && filters.maxArea !== "0"
          ? parseInt(filters.maxArea)
          : 0,
    };

    // Update search store
    updateSearchFilters({
      type: searchData.type,
      city: "",
      area: selectedLocalities.join(","),
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
    const filterCount = Object.values(filters).filter(
      (value) => value !== "" && value !== "0"
    ).length;
    return filterCount + selectedLocalities.length;
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0 shadow-sm">
        <button 
          onClick={onClose} 
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold">
          Filters ({getActiveFilterCount()})
        </h1>
        <button
          onClick={resetFilters}
          className="text-red-500 text-sm font-medium"
        >
          Reset
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        {/* Filter Sections */}
        <div className="px-4 space-y-4 py-4">
          {/* Select Localities */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Select Localities
            </h3>

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
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-lg"
                  />
                  {isSearchingLocalities && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>

                {/* Suggestions */}
                {localitySuggestions.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {localitySuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="px-3 py-2 hover:bg-red-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-200 group"
                        onClick={() => handleLocalitySelect(suggestion)}
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-red-400 mr-2 group-hover:text-red-500" />
                          <span className="text-gray-700 group-hover:text-gray-900">{suggestion.display_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Localities */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedLocalities.map((locality) => (
                <Badge
                  key={locality}
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {locality}
                  <button
                    onClick={() => removeLocality(locality)}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
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
              className={`text-sm h-8 px-3 rounded-lg border transition-all duration-200 ${
                showLocalitySearch 
                  ? 'border-red-200 text-red-600 hover:bg-red-50' 
                  : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {showLocalitySearch ? "Cancel" : "+ Add Locality"}
            </Button>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Budget Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.minPrice}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, minPrice: value }))
                }
              >
                <SelectTrigger className="h-10 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-lg">
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
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, maxPrice: value }))
                }
              >
                <SelectTrigger className="h-10 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-lg">
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
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Property Category
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_CATEGORIES.slice(0, 3).map((category) => (
                <div
                  key={category.value}
                  className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    filters.propertyCategory === category.value
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                  }`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyCategory:
                        prev.propertyCategory === category.value
                          ? ""
                          : category.value,
                    }))
                  }
                >
                  {filters.propertyCategory === category.value && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium">
                      {category.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Covered Area */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Covered Area (sqft)</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.minArea}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, minArea: value }))
                }
              >
                <SelectTrigger className="h-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-lg">
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
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, maxArea: value }))
                }
              >
                <SelectTrigger className="h-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-lg">
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
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Bedrooms</h3>
            <div className="grid grid-cols-2 gap-3">
              {BHK_OPTIONS.slice(0, 6).map((bhk) => (
                <div key={bhk.value} className="flex items-center p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                  <Checkbox
                    id={`mobile-bedroom-${bhk.value}`}
                    checked={filters.bedrooms === bhk.value}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        bedrooms: checked ? bhk.value : "",
                      }));
                    }}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <label
                    htmlFor={`mobile-bedroom-${bhk.value}`}
                    className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {bhk.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Furnishing Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Furnishing Status
            </h3>
            <div className="space-y-2">
              {FURNISHING_STATUS.map((status) => (
                <div key={status.value} className="flex items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                  <Checkbox
                    id={`mobile-furnishing-${status.value}`}
                    checked={filters.furnishingStatus === status.value}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        furnishingStatus: checked ? status.value : "",
                      }));
                    }}
                    className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                  <label
                    htmlFor={`mobile-furnishing-${status.value}`}
                    className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Possession Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Possession Status
            </h3>
            <div className="space-y-2">
              {POSSESSION_STATUS.map((status) => (
                <div key={status.value} className="flex items-center p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                  <Checkbox
                    id={`mobile-possession-${status.value}`}
                    checked={filters.possessionStatus === status.value}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        possessionStatus: checked ? status.value : "",
                      }));
                    }}
                    className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                  />
                  <label
                    htmlFor={`mobile-possession-${status.value}`}
                    className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
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
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50 flex-shrink-0 shadow-lg">
        <Button
          className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          onClick={handleSearch}
        >
          <Search className="w-5 h-5 mr-2" />
          View Properties
        </Button>
      </div>
    </div>
  );
}
