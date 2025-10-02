"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  BHK_OPTIONS,
  FURNISHING_STATUS,
  POSSESSION_STATUS,
} from "@/lib/config";
import { useSearchStore } from "@/lib/store";
import { Filter, X } from "lucide-react";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

interface FilterSectionProps {
  onSearch: () => void;
  handleFilterChange: (key: string, value: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  propertiesCount?: number;
}

export function FilterSection({
  onSearch,
  handleFilterChange,
  showFilters,
  setShowFilters,
  propertiesCount = 0,
}: FilterSectionProps) {
  const { searchFilters, updateSearchFilters }: any = useSearchStore();

  return (
    <>
      {/* Mobile filter drawer */}
      <div className="block sm:hidden mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-500 text-sm">{propertiesCount} properties found</p>
          </div>
          <MobileFilterDrawer
            onSearch={onSearch}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>
      
      {/* Tablet filter toggle */}
      <div className="hidden sm:block lg:hidden mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 h-12 px-4 text-base font-medium w-full sm:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter sidebar - hidden on mobile, conditional on tablet, always visible on desktop */}
      <div
        className={`hidden sm:${
          showFilters ? "block" : "hidden"
        } lg:block lg:w-72 flex-shrink-0`}
      >
        <Card className="p-4 sm:p-6 h-full overflow-y-auto mx-0 lg:mx-0 rounded-lg lg:rounded-lg border-0 lg:border shadow-lg lg:shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-lg font-semibold">
              Filter Properties
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              onClick={() => setShowFilters(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Property Type */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-base sm:text-sm text-gray-900">
              Property Type
            </h3>
            <div className="space-y-3 sm:space-y-2">
              {PROPERTY_TYPES.map((type) => (
                <div key={type.value} className="flex items-center">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={searchFilters.type === type.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("type", type.value);
                      } else {
                        handleFilterChange("type", "");
                      }
                    }}
                  />
                  <label
                    htmlFor={`type-${type.value}`}
                    className="ml-3 sm:ml-2 text-base sm:text-sm text-gray-600 cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Budget */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-base sm:text-sm text-gray-900">
              Budget
            </h3>
            <div className="flex items-center justify-between gap-3 sm:gap-2">
              <Select
                value={searchFilters.minPrice?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ minPrice: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
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
                  <SelectItem value="20000000">2 Cr</SelectItem>
                  <SelectItem value="30000000">3 Cr</SelectItem>
                  <SelectItem value="50000000">5 Cr</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-gray-500 text-sm font-medium px-1">to</span>

              <Select
                value={searchFilters.maxPrice?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ maxPrice: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
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
                  <SelectItem value="30000000">3 Cr</SelectItem>
                  <SelectItem value="50000000">5 Cr</SelectItem>
                  <SelectItem value="100000000">10 Cr</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Size */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-base sm:text-sm text-gray-900">
              Size
            </h3>
            <div className="flex items-center justify-between gap-3 sm:gap-2">
              <Select
                value={searchFilters.minArea?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ minArea: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
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

              <span className="text-gray-500 text-sm font-medium px-1">to</span>

              <Select
                value={searchFilters.maxArea?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ maxArea: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
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

          <Separator className="my-4" />

          {/* Bedrooms */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-base sm:text-sm text-gray-900">
              Bedrooms
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-2">
              {BHK_OPTIONS.map((bhk) => (
                <div key={bhk.value} className="flex items-center">
                  <Checkbox
                    id={`bedroom-${bhk.value}`}
                    checked={searchFilters.bedrooms === bhk.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("bedrooms", bhk.value);
                      } else {
                        handleFilterChange("bedrooms", "");
                      }
                    }}
                  />
                  <label
                    htmlFor={`bedroom-${bhk.value}`}
                    className="ml-3 sm:ml-2 text-base sm:text-sm text-gray-600 cursor-pointer"
                  >
                    {bhk.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Property Category */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-sm">Property Category</h3>
            <div className="space-y-2">
              {PROPERTY_CATEGORIES.map((category) => (
                <div key={category.value} className="flex items-center">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={searchFilters.propertyCategory === category.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("propertyCategory", category.value);
                      } else {
                        handleFilterChange("propertyCategory", "");
                      }
                    }}
                  />
                  <label
                    htmlFor={`category-${category.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Furnishing Status */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-sm">Furnishing Status</h3>
            <div className="space-y-2">
              {FURNISHING_STATUS.map((status) => (
                <div key={status.value} className="flex items-center">
                  <Checkbox
                    id={`furnishing-${status.value}`}
                    checked={searchFilters?.furnishingStatus === status.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("furnishingStatus", status.value);
                      } else {
                        handleFilterChange("furnishingStatus", "");
                      }
                    }}
                  />
                  <label
                    htmlFor={`furnishing-${status.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Possession Status */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-sm">Possession Status</h3>
            <div className="space-y-2">
              {POSSESSION_STATUS.map((status) => (
                <div key={status.value} className="flex items-center">
                  <Checkbox
                    id={`possession-${status.value}`}
                    checked={searchFilters.possessionStatus === status.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("possessionStatus", status.value);
                      } else {
                        handleFilterChange("possessionStatus", "");
                      }
                    }}
                  />
                  <label
                    htmlFor={`possession-${status.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-6 space-y-3 sm:space-y-2 sticky bottom-0 bg-white pt-4 border-t lg:border-t-0 lg:pt-0 lg:bg-transparent lg:static">
            <Button
              className="w-full h-12 sm:h-10 text-base sm:text-sm font-medium"
              onClick={onSearch}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 sm:h-10 text-base sm:text-sm"
              onClick={() => {
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
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
