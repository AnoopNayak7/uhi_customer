"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, BHK_OPTIONS, FURNISHING_STATUS, POSSESSION_STATUS } from "@/lib/config";
import { useSearchStore } from "@/lib/store";
import {
  Filter,
  X,
  MapPin,
  ArrowLeft,
} from "lucide-react";

interface MobileFilterDrawerProps {
  onSearch: () => void;
  handleFilterChange: (key: string, value: string) => void;
}

// Custom SheetContent without built-in close button
const CustomSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
));
CustomSheetContent.displayName = "CustomSheetContent";

export function MobileFilterDrawer({
  onSearch,
  handleFilterChange,
}: MobileFilterDrawerProps) {
  const { searchFilters, updateSearchFilters }: any = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);

  const clearAllFilters = () => {
    updateSearchFilters({
      type: "",
      city: "",
      area: "",
      minPrice: 0,
      maxPrice: 0,
      bedrooms: "",
      propertyCategory: "",
      furnishingStatus: "",
      possessionStatus: "",
    });
    window.location.href = "/properties";
  };

  const applyFilters = () => {
    onSearch();
    setIsOpen(false);
  };

  // Count active filters (including transaction types)
  const activeFiltersCount = Object.entries(searchFilters).filter(([key, value]) => {
    // Always count transaction types (buy, sell, commercial)
    if (key === 'type' && (value === 'sell' || value === 'buy' || value === 'commercial')) return true;
    
    // Exclude other default values from count
    if (key === 'city' && value === 'Bengaluru') return false;
    if (key === 'maxPrice' && value === 100000000) return false;
    if (key === 'minPrice' && value === 0) return false;
    if (key === 'minArea' && value === 0) return false;
    if (key === 'maxArea' && value === 0) return false;
    
    // Count only non-empty, non-zero values
    return value && value !== "" && value !== 0;
  }).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 text-sm font-medium bg-white border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-lg transition-all duration-300 shadow-sm"
        >
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700">Filters</span>
          {activeFiltersCount > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {activeFiltersCount}
            </div>
          )}
        </Button>
      </SheetTrigger>

      <CustomSheetContent className="h-[80vh] p-0 mt-16">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
              <p className="text-sm text-gray-500 mt-1">{activeFiltersCount} filters applied</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50/30">
            <div className="px-4 space-y-4 py-4">
              {/* Property Type */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Property Type</h3>
                <div className="space-y-3">
                  {PROPERTY_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Checkbox
                        id={`mobile-type-${type.value}`}
                        checked={searchFilters.type === type.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange("type", type.value);
                          } else {
                            handleFilterChange("type", "");
                          }
                        }}
                        className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                      />
                      <label
                        htmlFor={`mobile-type-${type.value}`}
                        className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Budget Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={searchFilters.minPrice?.toString() || ""}
                    onValueChange={(value) =>
                      updateSearchFilters({ minPrice: parseInt(value) || 0 })
                    }
                  >
                    <SelectTrigger className="h-10 border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-lg">
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
                    value={searchFilters.maxPrice?.toString() || ""}
                    onValueChange={(value) =>
                      updateSearchFilters({ maxPrice: parseInt(value) || 0 })
                    }
                  >
                    <SelectTrigger className="h-10 border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-lg">
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

              {/* Size */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Size Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={searchFilters.minArea?.toString() || ""}
                    onValueChange={(value) =>
                      updateSearchFilters({ minArea: parseInt(value) || 0 })
                    }
                  >
                    <SelectTrigger className="h-10 border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-lg">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Min</SelectItem>
                      <SelectItem value="500">500 sq.ft</SelectItem>
                      <SelectItem value="1000">1000 sq.ft</SelectItem>
                      <SelectItem value="1500">1500 sq.ft</SelectItem>
                      <SelectItem value="2000">2000 sq.ft</SelectItem>
                      <SelectItem value="2500">2500 sq.ft</SelectItem>
                      <SelectItem value="3000">3000 sq.ft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={searchFilters.maxArea?.toString() || ""}
                    onValueChange={(value) =>
                      updateSearchFilters({ maxArea: parseInt(value) || 0 })
                    }
                  >
                    <SelectTrigger className="h-10 border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-lg">
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

              {/* Property Category */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Property Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_CATEGORIES.slice(0, 4).map((category) => (
                    <div
                      key={category.value}
                      className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        searchFilters.propertyCategory === category.value
                          ? "border-red-500 bg-red-50 shadow-md"
                          : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                      }`}
                      onClick={() => handleFilterChange("propertyCategory", 
                        searchFilters.propertyCategory === category.value ? "" : category.value
                      )}
                    >
                      {searchFilters.propertyCategory === category.value && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                      <div className="text-center">
                        <span className="text-xs font-medium text-gray-700">{category.label}</span>
                      </div>
                    </div>
                  ))}
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
                        checked={searchFilters.bedrooms === bhk.value}
                        onCheckedChange={(checked) => {
                          handleFilterChange("bedrooms", checked ? bhk.value : "");
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
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Furnishing Status</h3>
                <div className="space-y-2">
                  {FURNISHING_STATUS.map((status) => (
                    <div key={status.value} className="flex items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                      <Checkbox
                        id={`mobile-furnishing-${status.value}`}
                        checked={searchFilters.furnishingStatus === status.value}
                        onCheckedChange={(checked) => {
                          handleFilterChange("furnishingStatus", checked ? status.value : "");
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
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Possession Status</h3>
                <div className="space-y-2">
                  {POSSESSION_STATUS.map((status) => (
                    <div key={status.value} className="flex items-center p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                      <Checkbox
                        id={`mobile-possession-${status.value}`}
                        checked={searchFilters.possessionStatus === status.value}
                        onCheckedChange={(checked) => {
                          handleFilterChange("possessionStatus", checked ? status.value : "");
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

          {/* Action Button */}
          <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50 flex-shrink-0 shadow-lg">
            <Button
              className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CustomSheetContent>
    </Sheet>
  );
}
