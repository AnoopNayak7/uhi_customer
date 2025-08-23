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
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, BHK_OPTIONS } from "@/lib/config";
import { useSearchStore } from "@/lib/store";
import {
  Filter,
  X,
  Home,
  Building,
  Building2,
  Warehouse,
  MapPin,
  IndianRupee,
  Bed,
  Users,
  Sparkles,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

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

  // Property type icons mapping
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "apartment":
      case "flat":
        return Building;
      case "villa":
      case "house":
        return Home;
      case "commercial":
        return Building2;
      case "warehouse":
        return Warehouse;
      default:
        return Home;
    }
  };

  // Price ranges for quick selection
  const priceRanges = [
    { label: "Under ₹50L", min: 0, max: 5000000 },
    { label: "₹50L - ₹1Cr", min: 5000000, max: 10000000 },
    { label: "₹1Cr - ₹2Cr", min: 10000000, max: 20000000 },
    { label: "₹2Cr - ₹5Cr", min: 20000000, max: 50000000 },
    { label: "Above ₹5Cr", min: 50000000, max: 0 },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="flex items-center gap-3 h-12 px-6 text-base font-medium w-full sm:w-auto relative border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 rounded-full shadow-sm hover:shadow-md"
          >
            <div className="relative">
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                >
                  {activeFiltersCount}
                </motion.div>
              )}
            </div>
            <span>Filters</span>
          </Button>
        </motion.div>
      </SheetTrigger>

      <CustomSheetContent className="h-[95vh] p-0 bg-white">
        <div className="flex flex-col h-full">
          {/* Modern Header with drag handle */}
          <div className="relative">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <SheetHeader className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Filter className="w-5 h-5 text-gray-700" />
                  </div>
                  <SheetTitle className="text-2xl font-bold text-gray-900">
                    Filters
                  </SheetTitle>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>
            </SheetHeader>
            <div className="h-px bg-gray-200 mx-6"></div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-8">
            {/* Property Type */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Property Type
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PROPERTY_TYPES.map((type) => {
                  const IconComponent = getPropertyTypeIcon(type.value);
                  const isSelected = searchFilters.type === type.value;

                  return (
                    <motion.div
                      key={type.value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (isSelected) {
                          handleFilterChange("type", "");
                        } else {
                          handleFilterChange("type", type.value);
                        }
                      }}
                      className={cn(
                        "relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                        isSelected
                          ? "border-gray-900 bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={cn(
                            "p-3 rounded-full transition-colors",
                            isSelected
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isSelected ? "text-gray-900" : "text-gray-700"
                          )}
                        >
                          {type.label}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-gray-900 text-white rounded-full p-1"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Price Range
                </h3>
              </div>
              <div className="space-y-3">
                {priceRanges.map((range, index) => {
                  const isSelected =
                    (searchFilters.minPrice === range.min ||
                      (range.min === 0 && !searchFilters.minPrice)) &&
                    (searchFilters.maxPrice === range.max ||
                      (range.max === 0 && !searchFilters.maxPrice));

                  return (
                    <motion.div
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isSelected) {
                          updateSearchFilters({ minPrice: 0, maxPrice: 0 });
                        } else {
                          updateSearchFilters({
                            minPrice: range.min,
                            maxPrice: range.max,
                          });
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                        isSelected
                          ? "border-gray-900 bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full transition-colors",
                            isSelected
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          <IndianRupee className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            "font-medium",
                            isSelected ? "text-gray-900" : "text-gray-700"
                          )}
                        >
                          {range.label}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-gray-900 text-white rounded-full p-1"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Bedrooms
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {BHK_OPTIONS.map((bhk) => {
                  const isSelected = searchFilters.bedrooms === bhk.value;

                  return (
                    <motion.button
                      key={bhk.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isSelected) {
                          handleFilterChange("bedrooms", "");
                        } else {
                          handleFilterChange("bedrooms", bhk.value);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full border-2 font-medium transition-all duration-200 min-w-[100px] justify-center",
                        isSelected
                          ? "border-gray-900 bg-gray-900 text-white shadow-md"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <Bed className="w-4 h-4" />
                      <span>{bhk.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Property Category */}
            <div className="space-y-5 pb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Property Category
                </h3>
              </div>
              <div className="space-y-3">
                {PROPERTY_CATEGORIES.map((category) => {
                  const isSelected =
                    searchFilters.propertyCategory === category.value;

                  return (
                    <motion.div
                      key={category.value}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isSelected) {
                          handleFilterChange("propertyCategory", "");
                        } else {
                          handleFilterChange(
                            "propertyCategory",
                            category.value
                          );
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                        isSelected
                          ? "border-gray-900 bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full transition-colors",
                            isSelected
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            "font-medium",
                            isSelected ? "text-gray-900" : "text-gray-700"
                          )}
                        >
                          {category.label}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-gray-900 text-white rounded-full p-1"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modern Bottom Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="text-gray-600 font-medium underline hover:text-gray-900 transition-colors"
              >
                Clear all
              </motion.button>
              <div className="text-sm text-gray-500">
                {activeFiltersCount > 0 && (
                  <span>
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? "s" : ""} applied
                  </span>
                )}
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={applyFilters}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Show properties</span>
              {activeFiltersCount > 0 && (
                <div className="bg-white bg-opacity-20 text-white text-xs rounded-full px-2 py-1 font-bold">
                  {activeFiltersCount}
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </CustomSheetContent>
    </Sheet>
  );
}
