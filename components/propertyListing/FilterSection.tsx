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
      {/* Tablet filter toggle */}
      <div className="hidden sm:block lg:hidden mb-4">
        <Button
          variant="outline"
          className="flex h-11 w-full items-center gap-2 rounded-full border-[#DDDDDD] font-manrope text-sm text-[#484848] hover:bg-[#FAFAFA] sm:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="size-4" strokeWidth={1.5} />
          {showFilters ? "Hide filters" : "Show filters"}
        </Button>
      </div>

      {/* Filter sidebar - tablet only; desktop uses horizontal bar */}
      <div
        className={`hidden sm:${
          showFilters ? "block" : "hidden"
        } sm:max-w-xs sm:flex-shrink-0 lg:hidden`}
      >
        <Card className="h-full overflow-y-auto rounded-[20px] border border-[#EBEBEB] bg-white p-4 shadow-none sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-manrope text-base font-semibold text-[#222222]">
              Filters
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
            <h3 className="home-card-label mb-3">
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
                    className="ml-3 sm:ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
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
            <h3 className="home-card-label mb-3">Budget</h3>
            <div className="flex items-center justify-between gap-3 sm:gap-2">
              <Select
                value={searchFilters.minPrice?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ minPrice: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-[#DDDDDD] font-manrope text-sm sm:h-10">
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

              <span className="px-1 font-manrope text-sm text-[#B0B0B0]">to</span>

              <Select
                value={searchFilters.maxPrice?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ maxPrice: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-[#DDDDDD] font-manrope text-sm sm:h-10">
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
            <h3 className="home-card-label mb-3">Size</h3>
            <div className="flex items-center justify-between gap-3 sm:gap-2">
              <Select
                value={searchFilters.minArea?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ minArea: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-[#DDDDDD] font-manrope text-sm sm:h-10">
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

              <span className="px-1 font-manrope text-sm text-[#B0B0B0]">to</span>

              <Select
                value={searchFilters.maxArea?.toString() || ""}
                onValueChange={(value) =>
                  updateSearchFilters({ maxArea: parseInt(value) || 0 })
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-[#DDDDDD] font-manrope text-sm sm:h-10">
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
            <h3 className="home-card-label mb-3">Bedrooms</h3>
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
                    className="ml-3 sm:ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
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
            <h3 className="home-card-label mb-3">Property Category</h3>
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
                    className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
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
            <h3 className="home-card-label mb-3">Furnishing Status</h3>
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
                    className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
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
            <h3 className="home-card-label mb-3">Possession Status</h3>
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
                    className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 mt-8 space-y-2 border-t border-[#F0F0F0] bg-white pt-4 lg:static lg:border-t-0 lg:bg-transparent lg:pt-0">
            <Button
              className="property-btn-pill h-11 w-full rounded-full bg-[#303030] text-white hover:bg-[#1a1a1a]"
              onClick={onSearch}
            >
              Apply filters
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-[#DDDDDD] font-manrope text-[#484848] hover:bg-[#FAFAFA]"
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
