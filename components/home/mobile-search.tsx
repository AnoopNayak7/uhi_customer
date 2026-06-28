"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  BHK_OPTIONS,
  FURNISHING_STATUS,
  POSSESSION_STATUS,
} from "@/lib/config";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search } from "lucide-react";

interface MobileSearchProps {
  onClose: () => void;
}

function countActiveFilters(filters: Record<string, unknown>) {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === "city" && (value === "Bengaluru" || !value)) return false;
    if (key === "type" && (value === "sell" || !value)) return false;
    if (key === "maxPrice" && (value === 100000000 || value === 0)) return false;
    if (
      (key === "minPrice" || key === "minArea" || key === "maxArea") &&
      (value === 0 || !value)
    ) {
      return false;
    }
    return value && value !== "" && value !== 0;
  }).length;
}

export function MobileSearch({ onClose }: MobileSearchProps) {
  const router = useRouter();
  const { searchFilters, updateSearchFilters } = useSearchStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "sell",
    area: "",
    minPrice: "0",
    maxPrice: "0",
    propertyCategory: "",
    bedrooms: "",
    furnishingStatus: "",
    possessionStatus: "",
    minArea: "0",
    maxArea: "0",
  });

  useEffect(() => {
    setFilters({
      type: searchFilters.type || "sell",
      area: searchFilters.area || "",
      minPrice: searchFilters.minPrice?.toString() || "0",
      maxPrice:
        searchFilters.maxPrice && searchFilters.maxPrice !== 100000000
          ? searchFilters.maxPrice.toString()
          : "0",
      propertyCategory: searchFilters.propertyCategory || "",
      bedrooms: searchFilters.bedrooms || "",
      furnishingStatus: searchFilters.furnishingStatus || "",
      possessionStatus: searchFilters.possessionStatus || "",
      minArea: searchFilters.minArea?.toString() || "0",
      maxArea: searchFilters.maxArea?.toString() || "0",
    });
  }, [searchFilters]);

  const activeCount = useMemo(
    () =>
      countActiveFilters({
        ...filters,
        minPrice: parseInt(filters.minPrice) || 0,
        maxPrice: parseInt(filters.maxPrice) || 0,
        minArea: parseInt(filters.minArea) || 0,
        maxArea: parseInt(filters.maxArea) || 0,
      }) + (searchQuery.trim() ? 1 : 0),
    [filters, searchQuery]
  );

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      type: "sell",
      area: "",
      minPrice: "0",
      maxPrice: "0",
      propertyCategory: "",
      bedrooms: "",
      furnishingStatus: "",
      possessionStatus: "",
      minArea: "0",
      maxArea: "0",
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    const trimmed = searchQuery.trim();

    if (trimmed) params.set("search", trimmed);
    if (filters.type) params.set("type", filters.type);
    if (filters.area.trim()) params.set("area", filters.area.trim());
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    if (filters.propertyCategory) {
      params.set("propertyCategory", filters.propertyCategory);
    }
    if (filters.furnishingStatus) {
      params.set("furnishingStatus", filters.furnishingStatus);
    }
    if (filters.possessionStatus) {
      params.set("possessionStatus", filters.possessionStatus);
    }
    if (filters.minPrice && filters.minPrice !== "0") {
      params.set("minPrice", filters.minPrice);
    }
    if (filters.maxPrice && filters.maxPrice !== "0") {
      params.set("maxPrice", filters.maxPrice);
    }
    if (filters.minArea && filters.minArea !== "0") {
      params.set("minArea", filters.minArea);
    }
    if (filters.maxArea && filters.maxArea !== "0") {
      params.set("maxArea", filters.maxArea);
    }

    updateSearchFilters({
      type: filters.type,
      city: "Bengaluru",
      area: filters.area.trim(),
      minPrice: parseInt(filters.minPrice) || 0,
      maxPrice: parseInt(filters.maxPrice) || 100000000,
      bedrooms: filters.bedrooms,
      propertyCategory: filters.propertyCategory,
      furnishingStatus: filters.furnishingStatus,
      possessionStatus: filters.possessionStatus,
      minArea: parseInt(filters.minArea) || 0,
      maxArea: parseInt(filters.maxArea) || 0,
    });

    router.push(`/properties?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAFAFA]">
      <div className="flex shrink-0 items-center justify-between border-b border-[#EBEBEB] bg-white px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full hover:bg-[#FAFAFA]"
          aria-label="Close search"
        >
          <ArrowLeft className="size-5 text-[#303030]" strokeWidth={1.5} />
        </button>
        <div className="text-center">
          <h1 className="font-manrope text-sm font-semibold text-[#222222]">
            Search properties
          </h1>
          {activeCount > 0 ? (
            <p className="font-manrope text-[11px] text-[#717171]">
              {activeCount} filter{activeCount === 1 ? "" : "s"} applied
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="font-manrope text-xs font-medium text-[#717171] hover:text-[#303030]"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Search</h3>
            <div className="flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-[#FAFAFA] px-3 py-1">
              <Search className="size-4 shrink-0 text-[#717171]" strokeWidth={1.5} />
              <Input
                type="search"
                placeholder="Builder, project, city or locality"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="h-10 flex-1 border-0 bg-transparent px-0 font-manrope text-sm shadow-none focus-visible:ring-0"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Property type</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, type: type.value }))
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 font-manrope text-xs font-medium transition-colors",
                    filters.type === type.value
                      ? "border-[#303030] bg-[#303030] text-white"
                      : "border-[#E8E8E8] bg-white text-[#484848] hover:border-[#D0D0D0]"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Preferred area</h3>
            <Input
              value={filters.area}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, area: e.target.value }))
              }
              placeholder="e.g. Whitefield, Hebbal, Sarjapur"
              className="h-11 rounded-xl border-[#DDDDDD] font-manrope text-sm"
              style={{ fontSize: "16px" }}
            />
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Budget range</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.minPrice}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, minPrice: value }))
                }
              >
                <SelectTrigger className="h-11 rounded-xl border-[#DDDDDD] font-manrope text-sm">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No min</SelectItem>
                  <SelectItem value="500000">₹5 Lac</SelectItem>
                  <SelectItem value="1000000">₹10 Lac</SelectItem>
                  <SelectItem value="2000000">₹20 Lac</SelectItem>
                  <SelectItem value="5000000">₹50 Lac</SelectItem>
                  <SelectItem value="10000000">₹1 Cr</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.maxPrice}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, maxPrice: value }))
                }
              >
                <SelectTrigger className="h-11 rounded-xl border-[#DDDDDD] font-manrope text-sm">
                  <SelectValue placeholder="Max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No max</SelectItem>
                  <SelectItem value="5000000">₹50 Lac</SelectItem>
                  <SelectItem value="10000000">₹1 Cr</SelectItem>
                  <SelectItem value="20000000">₹2 Cr</SelectItem>
                  <SelectItem value="30000000">₹3 Cr</SelectItem>
                  <SelectItem value="50000000">₹5 Cr</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Bedrooms</h3>
            <div className="grid grid-cols-2 gap-2">
              {BHK_OPTIONS.slice(0, 6).map((bhk) => (
                <div
                  key={bhk.value}
                  className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]"
                >
                  <Checkbox
                    id={`home-mobile-bhk-${bhk.value}`}
                    checked={filters.bedrooms === bhk.value}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        bedrooms: checked ? bhk.value : "",
                      }));
                    }}
                  />
                  <label
                    htmlFor={`home-mobile-bhk-${bhk.value}`}
                    className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
                  >
                    {bhk.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Property category</h3>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_CATEGORIES.slice(0, 4).map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={cn(
                    "rounded-xl border p-2.5 text-center transition-colors",
                    filters.propertyCategory === category.value
                      ? "border-[#303030] bg-[#FAFAFA]"
                      : "border-[#EBEBEB] hover:border-[#DDDDDD]"
                  )}
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
                  <span className="font-manrope text-xs text-[#484848]">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Furnishing</h3>
            <div className="space-y-1">
              {FURNISHING_STATUS.map((status) => (
                <div
                  key={status.value}
                  className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]"
                >
                  <Checkbox
                    id={`home-mobile-furnishing-${status.value}`}
                    checked={filters.furnishingStatus === status.value}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        furnishingStatus: checked ? status.value : "",
                      }));
                    }}
                  />
                  <label
                    htmlFor={`home-mobile-furnishing-${status.value}`}
                    className="ml-2 cursor-pointer font-manrope text-sm text-[#717171]"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-4">
            <h3 className="home-card-label mb-3">Possession</h3>
            <div className="space-y-1">
              {POSSESSION_STATUS.map((status) => (
                <div
                  key={status.value}
                  className="flex items-center rounded-lg p-2 hover:bg-[#FAFAFA]"
                >
                  <Checkbox
                    id={`home-mobile-possession-${status.value}`}
                    checked={filters.possessionStatus === status.value}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        possessionStatus: checked ? status.value : "",
                      }));
                    }}
                  />
                  <label
                    htmlFor={`home-mobile-possession-${status.value}`}
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

      <div className="shrink-0 border-t border-[#EBEBEB] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          className="property-btn-pill h-12 w-full rounded-full bg-[#303030] font-manrope text-white hover:bg-[#1a1a1a]"
          onClick={handleSearch}
        >
          <Search className="mr-2 size-4" strokeWidth={1.5} />
          View properties
        </Button>
      </div>
    </div>
  );
}
