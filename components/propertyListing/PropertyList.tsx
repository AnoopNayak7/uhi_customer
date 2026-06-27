"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3, Map as MapIcon, SearchX } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { usePropertyStore } from "@/lib/store";
import { AnimatedPropertyGrid } from "@/components/animations/animated-property-list";
import { MotionWrapper } from "@/components/animations/motion-wrapper";

interface PropertyListProps {
  properties: any[];
  loading: boolean;
  viewMode: "grid" | "map";
  setViewMode: (mode: "grid" | "map") => void;
  onFavorite?: (property: any) => void;
  onClearFilters?: () => void;
}

export function PropertyList({
  properties,
  loading,
  viewMode,
  setViewMode,
  onFavorite,
  onClearFilters,
}: PropertyListProps) {
  const { favourites } = usePropertyStore();

  const handleFavorite = (property: any) => {
    if (onFavorite) {
      onFavorite(property);
    } else {
      // Fallback to local store if no onFavorite prop provided
      const { addToFavourites, removeFromFavourites } = usePropertyStore.getState();
      const isFavorite = favourites.some((p) => p.id === property.id);
      if (isFavorite) {
        removeFromFavourites(property.id);
      } else {
        addToFavourites(property);
      }
    }
  };

  return (
    <div className="flex-1 overflow-x-hidden">

      {viewMode === "grid" ? (
        <AnimatedPropertyGrid
          loading={loading}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6"
        >
          {properties.length > 0
            ? properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={() => handleFavorite(property)}
                  isFavorite={favourites.some((p) => p.id === property.id)}
                  compact={true}
                />
              ))
            : !loading
            ? [
                <Card
                  key="no-results"
                  className="p-8 sm:p-12 text-center col-span-full flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <SearchX
                      className="w-7 h-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-gray-900 text-base font-medium">
                    No properties found matching your criteria.
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Try widening your search or clearing the filters.
                  </p>
                  {onClearFilters && (
                    <Button
                      variant="outline"
                      onClick={onClearFilters}
                      className="mt-5"
                    >
                      Clear all filters
                    </Button>
                  )}
                </Card>,
              ]
            : []}
        </AnimatedPropertyGrid>
      ) : null}
    </div>
  );
}
