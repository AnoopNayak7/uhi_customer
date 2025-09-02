"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3, Map as MapIcon } from "lucide-react";
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
}

export function PropertyList({
  properties,
  loading,
  viewMode,
  setViewMode,
  onFavorite,
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
      <MotionWrapper variant="fadeInUp">
        {/* Grid/Map toggle removed - now handled in main page */}
      </MotionWrapper>

      {viewMode === "grid" ? (
        <AnimatedPropertyGrid
          loading={loading}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6"
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
                  className="p-6 sm:p-8 text-center col-span-full"
                >
                  <p className="text-gray-500 text-base sm:text-base">
                    No properties found matching your criteria.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your filters.
                  </p>
                </Card>,
              ]
            : []}
        </AnimatedPropertyGrid>
      ) : null}
    </div>
  );
}
