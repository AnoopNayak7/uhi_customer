"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROPERTY_TYPES,
  BHK_OPTIONS,
} from "@/lib/config";
import { useSearchStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { ViewModeToggle } from "./properties-view-controls";
import { BudgetRangeFilter } from "./BudgetRangeFilter";
import { MoreFiltersPanel } from "./MoreFiltersPanel";

interface HorizontalFilterBarProps {
  onSearch: () => void;
  handleFilterChange: (key: string, value: string) => void;
  viewMode: "grid" | "map";
  setViewMode: (mode: "grid" | "map") => void;
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-pill shrink-0 ${active ? "filter-pill-active" : ""}`}
    >
      {children}
    </button>
  );
}

export function HorizontalFilterBar({
  onSearch,
  handleFilterChange,
  viewMode,
  setViewMode,
}: HorizontalFilterBarProps) {
  const { searchFilters, updateSearchFilters }: any = useSearchStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushFilterUpdate = (updates: Record<string, string | number>) => {
    updateSearchFilters(updates);

    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.push(`/properties?${params.toString()}`);
  };

  const clearAllFilters = () => {
    updateSearchFilters({
      type: "",
      city: "",
      area: "",
      minPrice: 0,
      maxPrice: 0,
      minArea: 0,
      maxArea: 0,
      bedrooms: "",
      propertyCategory: "",
      furnishingStatus: "",
      possessionStatus: "",
      builderId: "",
    });
    router.push("/properties");
  };

  const hasActiveFilters =
    searchFilters.type ||
    searchFilters.bedrooms ||
    searchFilters.propertyCategory ||
    searchFilters.furnishingStatus ||
    searchFilters.possessionStatus ||
    searchFilters.builderId ||
    (searchFilters.minPrice && searchFilters.minPrice > 0) ||
    (searchFilters.maxPrice && searchFilters.maxPrice > 0) ||
    (searchFilters.minArea && searchFilters.minArea > 0) ||
    (searchFilters.maxArea && searchFilters.maxArea > 0);

  return (
    <div className="mt-3 w-full border-t border-[#F0F0F0] pt-3">
      <div className="flex w-full items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PROPERTY_TYPES.map((type) => (
            <FilterPill
              key={type.value}
              active={searchFilters.type === type.value}
              onClick={() =>
                handleFilterChange(
                  "type",
                  searchFilters.type === type.value ? "" : type.value
                )
              }
            >
              {type.label}
            </FilterPill>
          ))}

          <span className="mx-0.5 h-5 w-px shrink-0 bg-[#EBEBEB]" />

          <BudgetRangeFilter
            minPrice={searchFilters.minPrice || 0}
            maxPrice={searchFilters.maxPrice || 0}
            onMinChange={(value) => pushFilterUpdate({ minPrice: value })}
            onMaxChange={(value) => pushFilterUpdate({ maxPrice: value })}
          />

          <span className="mx-0.5 h-5 w-px shrink-0 bg-[#EBEBEB]" />

          <Select
            value={searchFilters.bedrooms || "all"}
            onValueChange={(value) =>
              handleFilterChange("bedrooms", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="filter-select h-9 w-[6.5rem] shrink-0">
              <SelectValue placeholder="BHK" />
            </SelectTrigger>
            <SelectContent className="filter-select-content" position="popper">
              <SelectItem value="all" className="filter-select-item">
                Any BHK
              </SelectItem>
              {BHK_OPTIONS.slice(0, 6).map((bhk) => (
                <SelectItem
                  key={bhk.value}
                  value={bhk.value}
                  className="filter-select-item"
                >
                  {bhk.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <MoreFiltersPanel />

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAllFilters}
              className="filter-pill shrink-0 gap-1 text-[#5C5C5C] hover:border-[#B0B0B0] hover:text-[#222222]"
            >
              <X className="size-3" strokeWidth={1.5} />
              Clear
            </button>
          ) : null}
        </div>

        <ViewModeToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          className="hidden shrink-0 lg:inline-flex"
        />
      </div>
    </div>
  );
}
