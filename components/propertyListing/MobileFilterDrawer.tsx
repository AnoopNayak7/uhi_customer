"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, BHK_OPTIONS, FURNISHING_STATUS, POSSESSION_STATUS } from "@/lib/config";
import { useSearchStore } from "@/lib/store";
import { useDevelopersFilter } from "./use-developers-filter";
import { BuilderFilterGrid } from "./builder-filter-grid";
import {
  Filter,
  X,
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
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.08)] transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-x-0 bottom-0 rounded-t-[24px] border-t border-[#EBEBEB] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
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
  const [builderSearch, setBuilderSearch] = useState("");
  const { developers, loading: loadingDevelopers } = useDevelopersFilter(isOpen);

  const filteredDevelopers = developers.filter((developer) => {
    const query = builderSearch.trim().toLowerCase();
    if (!query) return true;
    return developer.name.toLowerCase().includes(query);
  });

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
      builderId: "",
    });
    window.location.href = "/properties";
  };

  const applyFilters = () => {
    onSearch();
    setIsOpen(false);
  };

  // Count active filters (excluding defaults)
  const activeFiltersCount = Object.entries(searchFilters).filter(
    ([key, value]) => {
      if (key === "city" && (value === "Bengaluru" || !value)) return false;
      if (key === "type" && (value === "sell" || !value)) return false;
      if (key === "maxPrice" && (value === 100000000 || value === 0)) {
        return false;
      }
      if (
        (key === "minPrice" || key === "minArea" || key === "maxArea") &&
        (value === 0 || !value)
      ) {
        return false;
      }
      return value && value !== "" && value !== 0;
    }
  ).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-3.5 font-manrope text-xs font-medium text-[#303030] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <Filter className="size-3.5" strokeWidth={1.5} />
          Filters
          {activeFiltersCount > 0 ? (
            <span className="flex size-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#303030] font-manrope text-[10px] font-semibold leading-none text-white">
              {activeFiltersCount > 9 ? "9+" : activeFiltersCount}
            </span>
          ) : null}
        </button>
      </SheetTrigger>

      <CustomSheetContent className="h-[85vh] p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-4">
            <div>
              <p className="home-section-eyebrow mb-0">Refine</p>
              <h2 className="font-manrope text-base font-semibold text-[#222222]">
                Filters
              </h2>
              <p className="mt-1 font-manrope text-sm text-[#717171]">
                {activeFiltersCount} applied
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="rounded-full font-manrope text-sm text-[#717171] hover:bg-[#FAFAFA] hover:text-[#222222]"
              >
                Clear all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="size-10 rounded-full p-0 hover:bg-[#FAFAFA]"
              >
                <X className="size-5" strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
            <div className="space-y-4 px-4 py-4">
              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Property Type</h3>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]">
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
                      />
                      <label
                        htmlFor={`mobile-type-${type.value}`}
                        className="ml-3 cursor-pointer font-manrope text-sm text-[#717171]"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Builder</h3>
                <Input
                  value={builderSearch}
                  onChange={(e) => setBuilderSearch(e.target.value)}
                  placeholder="Search builders..."
                  className="mb-3 h-10 rounded-xl border-[#DDDDDD] font-manrope text-sm"
                />
                <BuilderFilterGrid
                  developers={filteredDevelopers}
                  loading={loadingDevelopers}
                  selectedId={searchFilters.builderId || ""}
                  onSelect={(builderId) =>
                    handleFilterChange("builderId", builderId)
                  }
                />
              </div>

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Budget Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={searchFilters.minPrice?.toString() || ""}
                    onValueChange={(value) =>
                      updateSearchFilters({ minPrice: parseInt(value) || 0 })
                    }
                  >
                    <SelectTrigger className="h-10 rounded-xl border-[#DDDDDD] font-manrope text-sm">
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
                    <SelectTrigger className="h-10 rounded-xl border-[#DDDDDD] font-manrope text-sm">
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

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Size Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={searchFilters.minArea?.toString() || ""}
                    onValueChange={(value) =>
                      updateSearchFilters({ minArea: parseInt(value) || 0 })
                    }
                  >
                    <SelectTrigger className="h-10 rounded-xl border-[#DDDDDD] font-manrope text-sm">
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
                    <SelectTrigger className="h-10 rounded-xl border-[#DDDDDD] font-manrope text-sm">
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

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Property Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_CATEGORIES.slice(0, 4).map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      className={`relative rounded-xl border p-2 text-center transition-all ${
                        searchFilters.propertyCategory === category.value
                          ? "border-[#303030] bg-[#FAFAFA]"
                          : "border-[#EBEBEB] hover:border-[#DDDDDD] hover:bg-[#FAFAFA]"
                      }`}
                      onClick={() =>
                        handleFilterChange(
                          "propertyCategory",
                          searchFilters.propertyCategory === category.value
                            ? ""
                            : category.value
                        )
                      }
                    >
                      <span className="font-manrope text-xs text-[#484848]">
                        {category.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Bedrooms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {BHK_OPTIONS.slice(0, 6).map((bhk) => (
                    <div key={bhk.value} className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]">
                      <Checkbox
                        id={`mobile-bedroom-${bhk.value}`}
                        checked={searchFilters.bedrooms === bhk.value}
                        onCheckedChange={(checked) => {
                          handleFilterChange("bedrooms", checked ? bhk.value : "");
                        }}
                      />
                      <label
                        htmlFor={`mobile-bedroom-${bhk.value}`}
                        className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
                      >
                        {bhk.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Furnishing Status</h3>
                <div className="space-y-1">
                  {FURNISHING_STATUS.map((status) => (
                    <div key={status.value} className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]">
                      <Checkbox
                        id={`mobile-furnishing-${status.value}`}
                        checked={searchFilters.furnishingStatus === status.value}
                        onCheckedChange={(checked) => {
                          handleFilterChange(
                            "furnishingStatus",
                            checked ? status.value : ""
                          );
                        }}
                      />
                      <label
                        htmlFor={`mobile-furnishing-${status.value}`}
                        className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
                      >
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
                <h3 className="home-card-label mb-3">Possession Status</h3>
                <div className="space-y-1">
                  {POSSESSION_STATUS.map((status) => (
                    <div key={status.value} className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]">
                      <Checkbox
                        id={`mobile-possession-${status.value}`}
                        checked={searchFilters.possessionStatus === status.value}
                        onCheckedChange={(checked) => {
                          handleFilterChange(
                            "possessionStatus",
                            checked ? status.value : ""
                          );
                        }}
                      />
                      <label
                        htmlFor={`mobile-possession-${status.value}`}
                        className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
                      >
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-[#F0F0F0] bg-white p-4">
            <Button
              className="property-btn-pill h-12 w-full rounded-full bg-[#303030] font-manrope text-white hover:bg-[#1a1a1a]"
              onClick={applyFilters}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </CustomSheetContent>
    </Sheet>
  );
}
