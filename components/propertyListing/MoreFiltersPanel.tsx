"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PROPERTY_CATEGORIES,
  FURNISHING_STATUS,
  POSSESSION_STATUS,
} from "@/lib/config";
import { useSearchStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDevelopersFilter } from "./use-developers-filter";
import { BuilderFilterGrid } from "./builder-filter-grid";

type MoreFilterSection =
  | "builder"
  | "size"
  | "category"
  | "furnishing"
  | "possession";

interface MoreFiltersDraft {
  builderId: string;
  minArea: number;
  maxArea: number;
  propertyCategory: string;
  furnishingStatus: string;
  possessionStatus: string;
}

const SECTIONS: { id: MoreFilterSection; label: string }[] = [
  { id: "builder", label: "Builder" },
  { id: "size", label: "Size" },
  { id: "category", label: "Category" },
  { id: "furnishing", label: "Furnishing" },
  { id: "possession", label: "Possession" },
];

const EMPTY_DRAFT: MoreFiltersDraft = {
  builderId: "",
  minArea: 0,
  maxArea: 0,
  propertyCategory: "",
  furnishingStatus: "",
  possessionStatus: "",
};

function draftFromFilters(filters: Record<string, unknown>): MoreFiltersDraft {
  return {
    builderId: String(filters.builderId || ""),
    minArea: Number(filters.minArea) || 0,
    maxArea: Number(filters.maxArea) || 0,
    propertyCategory: String(filters.propertyCategory || ""),
    furnishingStatus: String(filters.furnishingStatus || ""),
    possessionStatus: String(filters.possessionStatus || ""),
  };
}

function draftSectionHasValue(id: MoreFilterSection, draft: MoreFiltersDraft) {
  switch (id) {
    case "builder":
      return Boolean(draft.builderId);
    case "size":
      return draft.minArea > 0 || draft.maxArea > 0;
    case "category":
      return Boolean(draft.propertyCategory);
    case "furnishing":
      return Boolean(draft.furnishingStatus);
    case "possession":
      return Boolean(draft.possessionStatus);
    default:
      return false;
  }
}

function appliedSectionHasValue(
  id: MoreFilterSection,
  filters: Record<string, unknown>
) {
  return draftSectionHasValue(id, draftFromFilters(filters));
}

function OptionPill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-left font-manrope text-sm font-medium transition-colors",
        active
          ? "border-[#303030] bg-[#303030] text-white"
          : "border-[#D4D4D4] bg-white text-[#484848] hover:border-[#B0B0B0] hover:bg-[#FAFAFA] hover:text-[#222222]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function MoreFiltersPanel() {
  const { searchFilters, updateSearchFilters }: any = useSearchStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<MoreFilterSection>("builder");
  const [draft, setDraft] = useState<MoreFiltersDraft>(EMPTY_DRAFT);
  const [builderSearch, setBuilderSearch] = useState("");
  const { developers, loading: loadingDevelopers } = useDevelopersFilter(open);

  const filteredDevelopers = useMemo(() => {
    const query = builderSearch.trim().toLowerCase();
    if (!query) return developers;

    return developers.filter((developer) =>
      developer.name.toLowerCase().includes(query)
    );
  }, [builderSearch, developers]);

  const moreFiltersActive = SECTIONS.some((section) =>
    appliedSectionHasValue(section.id, searchFilters)
  );

  const handleApply = () => {
    updateSearchFilters({
      builderId: draft.builderId,
      minArea: draft.minArea,
      maxArea: draft.maxArea,
      propertyCategory: draft.propertyCategory,
      furnishingStatus: draft.furnishingStatus,
      possessionStatus: draft.possessionStatus,
    });

    const params = new URLSearchParams(searchParams.toString());
    const entries: [string, string | number][] = [
      ["builderId", draft.builderId],
      ["minArea", draft.minArea],
      ["maxArea", draft.maxArea],
      ["propertyCategory", draft.propertyCategory],
      ["furnishingStatus", draft.furnishingStatus],
      ["possessionStatus", draft.possessionStatus],
    ];

    entries.forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.push(`/properties?${params.toString()}`);
    setOpen(false);
  };

  const handleClearSection = () => {
    setDraft((prev) => {
      switch (activeSection) {
        case "builder":
          return { ...prev, builderId: "" };
        case "size":
          return { ...prev, minArea: 0, maxArea: 0 };
        case "category":
          return { ...prev, propertyCategory: "" };
        case "furnishing":
          return { ...prev, furnishingStatus: "" };
        case "possession":
          return { ...prev, possessionStatus: "" };
        default:
          return prev;
      }
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setDraft(draftFromFilters(searchFilters));
    if (!nextOpen) {
      setBuilderSearch("");
    }
    setOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "filter-pill shrink-0 gap-1.5",
            moreFiltersActive && "filter-pill-active"
          )}
        >
          <SlidersHorizontal className="size-3.5" strokeWidth={1.5} />
          More
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(100vw-2rem,42rem)] overflow-hidden rounded-[24px] border border-[#DDDDDD] bg-white p-0 shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
      >
        <div className="border-b border-[#E8E8E8] bg-[#FAFAFA] px-5 py-4">
          <p className="home-section-eyebrow mb-0 text-[#767676]">Refine</p>
          <p className="font-manrope text-base font-semibold text-[#1A1A1A]">
            More filters
          </p>
        </div>

        <div className="flex min-h-[280px] overflow-hidden">
          <nav className="flex w-[10rem] shrink-0 flex-col gap-1 bg-[#F5F5F5] p-2.5">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              const hasApplied = appliedSectionHasValue(
                section.id,
                searchFilters
              );
              const hasDraft = draftSectionHasValue(section.id, draft);

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-left font-manrope text-sm transition-colors",
                    isActive
                      ? "bg-white font-semibold text-[#1A1A1A] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                      : "font-medium text-[#484848] hover:bg-white/70 hover:text-[#222222]"
                  )}
                >
                  <span>{section.label}</span>
                  {hasApplied || hasDraft ? (
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        hasDraft && !hasApplied
                          ? "bg-[#B0B0B0]"
                          : "bg-[#303030]"
                      )}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="min-w-0 flex-1 border-l border-[#E8E8E8] bg-white p-5">
            {activeSection === "builder" ? (
              <div className="space-y-4">
                <div>
                  <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                    Builder / developer
                  </p>
                  <p className="mt-1 font-manrope text-xs text-[#484848]">
                    Show properties from a specific builder
                  </p>
                </div>

                <Input
                  value={builderSearch}
                  onChange={(e) => setBuilderSearch(e.target.value)}
                  placeholder="Search builders..."
                  className="h-10 rounded-xl border-[#DDDDDD] font-manrope text-sm"
                />

                <div className="max-h-[300px] overflow-y-auto pr-1">
                  <BuilderFilterGrid
                    developers={filteredDevelopers}
                    loading={loadingDevelopers}
                    selectedId={draft.builderId}
                    onSelect={(builderId) =>
                      setDraft((prev) => ({ ...prev, builderId }))
                    }
                  />
                </div>
              </div>
            ) : null}

            {activeSection === "size" ? (
              <div className="space-y-4">
                <div>
                  <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                    Property size
                  </p>
                  <p className="mt-1 font-manrope text-xs text-[#484848]">
                    Set a minimum and maximum area in sq.ft
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="font-manrope text-[11px] font-semibold uppercase tracking-[0.08em] text-[#767676]">
                      Minimum
                    </label>
                    <Select
                      value={draft.minArea.toString()}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev,
                          minArea: parseInt(value, 10) || 0,
                        }))
                      }
                    >
                      <SelectTrigger className="filter-select h-11 w-full">
                        <SelectValue placeholder="No min" />
                      </SelectTrigger>
                      <SelectContent
                        className="filter-select-content"
                        position="popper"
                      >
                        <SelectItem value="0" className="filter-select-item">
                          No min
                        </SelectItem>
                        <SelectItem value="500" className="filter-select-item">
                          500 sq.ft
                        </SelectItem>
                        <SelectItem value="1000" className="filter-select-item">
                          1,000 sq.ft
                        </SelectItem>
                        <SelectItem value="1500" className="filter-select-item">
                          1,500 sq.ft
                        </SelectItem>
                        <SelectItem value="2000" className="filter-select-item">
                          2,000 sq.ft
                        </SelectItem>
                        <SelectItem value="3000" className="filter-select-item">
                          3,000 sq.ft
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-manrope text-[11px] font-semibold uppercase tracking-[0.08em] text-[#767676]">
                      Maximum
                    </label>
                    <Select
                      value={draft.maxArea.toString()}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev,
                          maxArea: parseInt(value, 10) || 0,
                        }))
                      }
                    >
                      <SelectTrigger className="filter-select h-11 w-full">
                        <SelectValue placeholder="No max" />
                      </SelectTrigger>
                      <SelectContent
                        className="filter-select-content"
                        position="popper"
                      >
                        <SelectItem value="0" className="filter-select-item">
                          No max
                        </SelectItem>
                        <SelectItem value="1000" className="filter-select-item">
                          1,000 sq.ft
                        </SelectItem>
                        <SelectItem value="2000" className="filter-select-item">
                          2,000 sq.ft
                        </SelectItem>
                        <SelectItem value="3000" className="filter-select-item">
                          3,000 sq.ft
                        </SelectItem>
                        <SelectItem value="5000" className="filter-select-item">
                          5,000 sq.ft
                        </SelectItem>
                        <SelectItem value="10000" className="filter-select-item">
                          10,000 sq.ft
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : null}

            {activeSection === "category" ? (
              <div className="space-y-4">
                <div>
                  <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                    Property category
                  </p>
                  <p className="mt-1 font-manrope text-xs text-[#484848]">
                    Choose the type of property you are looking for
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PROPERTY_CATEGORIES.map((category) => (
                    <OptionPill
                      key={category.value}
                      active={draft.propertyCategory === category.value}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          propertyCategory:
                            prev.propertyCategory === category.value
                              ? ""
                              : category.value,
                        }))
                      }
                    >
                      {category.label}
                    </OptionPill>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === "furnishing" ? (
              <div className="space-y-4">
                <div>
                  <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                    Furnishing status
                  </p>
                  <p className="mt-1 font-manrope text-xs text-[#484848]">
                    Filter by how the property is furnished
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {FURNISHING_STATUS.map((status) => (
                    <OptionPill
                      key={status.value}
                      active={draft.furnishingStatus === status.value}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          furnishingStatus:
                            prev.furnishingStatus === status.value
                              ? ""
                              : status.value,
                        }))
                      }
                    >
                      {status.label}
                    </OptionPill>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === "possession" ? (
              <div className="space-y-4">
                <div>
                  <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                    Possession status
                  </p>
                  <p className="mt-1 font-manrope text-xs text-[#484848]">
                    Ready to move, under construction, and more
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {POSSESSION_STATUS.map((status) => (
                    <OptionPill
                      key={status.value}
                      active={draft.possessionStatus === status.value}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          possessionStatus:
                            prev.possessionStatus === status.value
                              ? ""
                              : status.value,
                        }))
                      }
                    >
                      {status.label}
                    </OptionPill>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#E8E8E8] bg-[#FAFAFA] px-5 py-4">
          <button
            type="button"
            onClick={handleClearSection}
            disabled={!draftSectionHasValue(activeSection, draft)}
            className="font-manrope text-sm font-medium text-[#484848] hover:text-[#1A1A1A] disabled:pointer-events-none disabled:opacity-40"
          >
            Clear section
          </button>
          <Button
            className="property-btn-pill h-11 rounded-full bg-[#303030] px-8 text-white hover:bg-[#1a1a1a]"
            onClick={handleApply}
          >
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
