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

  // Count active filters
  const activeFiltersCount = Object.values(searchFilters).filter(
    (value) => value && value !== "" && value !== 0
  ).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-12 px-4 text-sm font-medium w-full relative"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {activeFiltersCount}
            </div>
          )}
        </Button>
      </SheetTrigger>

      <CustomSheetContent className="h-[90vh] p-0 bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <button onClick={() => setIsOpen(false)} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Filters ({activeFiltersCount})</h1>
            <button onClick={clearAllFilters} className="text-red-500 text-sm font-medium">
              Reset
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Filter Sections */}
            <div className="px-4 space-y-6 py-4">
              {/* Property Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Property Type</h3>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center">
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
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`mobile-type-${type.value}`}
                        className="ml-2 text-sm text-gray-600"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Budget */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Budget</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={searchFilters.minPrice?.toString() || "0"}
                    onValueChange={(value) =>
                      updateSearchFilters({ minPrice: parseInt(value) || 0 })
                    }
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
                    value={searchFilters.maxPrice?.toString() || "0"}
                    onValueChange={(value) =>
                      updateSearchFilters({ maxPrice: parseInt(value) || 0 })
                    }
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

              <Separator />

              {/* Property Category */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Property Category</h3>
                <div className="space-y-2">
                  {PROPERTY_CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <Checkbox
                        id={`mobile-category-${category.value}`}
                        checked={searchFilters.propertyCategory === category.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange("propertyCategory", category.value);
                          } else {
                            handleFilterChange("propertyCategory", "");
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`mobile-category-${category.value}`}
                        className="ml-2 text-sm text-gray-600"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Bedrooms */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Bedrooms</h3>
                <div className="grid grid-cols-2 gap-3">
                  {BHK_OPTIONS.slice(0, 6).map((bhk) => (
                    <div key={bhk.value} className="flex items-center">
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
                        className="h-4 w-4"
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

              <Separator />

              {/* Furnishing Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Furnishing Status</h3>
                <div className="space-y-2">
                  {FURNISHING_STATUS.map((status) => (
                    <div key={status.value} className="flex items-center">
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
                        className="h-4 w-4"
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

              <Separator />

              {/* Possession Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Possession Status</h3>
                <div className="space-y-2">
                  {POSSESSION_STATUS.map((status) => (
                    <div key={status.value} className="flex items-center">
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
                        className="h-4 w-4"
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
