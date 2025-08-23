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
}

export function PropertyList({
  properties,
  loading,
  viewMode,
  setViewMode,
}: PropertyListProps) {
  const { favourites } = usePropertyStore();
  const { addToFavourites, removeFromFavourites } = usePropertyStore();

  const handleFavorite = (property: any) => {
    const isFavorite = favourites.some((p) => p.id === property.id);
    if (isFavorite) {
      removeFromFavourites(property.id);
    } else {
      addToFavourites(property);
    }
  };

  return (
    <div className="flex-1">
      <MotionWrapper variant="fadeInUp">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Properties</h1>
            <p className="text-gray-500 text-sm">
              {properties?.length} properties found
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-md p-1 flex">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="w-4 h-4 mr-1" />
                Map
              </Button>
            </div>
          </div>
        </div>
      </MotionWrapper>

      <hr className="my-4" />

      {viewMode === "grid" ? (
        <AnimatedPropertyGrid
          loading={loading}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
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
                  className="p-8 text-center col-span-full"
                >
                  <p className="text-gray-500">
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
