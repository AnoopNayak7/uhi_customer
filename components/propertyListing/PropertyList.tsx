"use client";

import { HomePropertyCard } from "@/components/home/home-property-card";
import { usePropertyStore } from "@/lib/store";
import { AnimatedPropertyGrid } from "@/components/animations/animated-property-list";

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
  onFavorite,
}: PropertyListProps) {
  const {
    favourites,
    compareList,
    addToFavourites,
    removeFromFavourites,
    addToCompare,
    removeFromCompare,
  } = usePropertyStore();

  const handleFavourite = (property: any) => {
    if (onFavorite) {
      onFavorite(property);
      return;
    }

    const isFavorite = favourites.some((p) => p.id === property.id);
    if (isFavorite) {
      removeFromFavourites(property.id);
    } else {
      addToFavourites(property);
    }
  };

  const toggleCompare = (property: any) => {
    if (compareList.some((p) => p.id === property.id)) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property);
    }
  };

  return (
    <div className="flex-1 overflow-x-hidden">
      <AnimatedPropertyGrid
        loading={loading}
        className="grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {properties.length > 0
          ? properties.map((property) => (
              <HomePropertyCard
                key={property.id}
                property={property}
                onFavourite={() => handleFavourite(property)}
                isFavourite={favourites.some((p) => p.id === property.id)}
                onCompare={() => toggleCompare(property)}
                isInCompare={compareList.some((p) => p.id === property.id)}
              />
            ))
          : !loading
            ? [
                <div
                  key="no-results"
                  className="col-span-full rounded-[20px] border border-[#EBEBEB] bg-white px-6 py-12 text-center"
                >
                  <p className="font-manrope text-base font-medium text-[#222222]">
                    No properties found matching your criteria.
                  </p>
                  <p className="mt-2 font-manrope text-sm text-[#5C5C5C]">
                    Try adjusting your filters or search in a different area.
                  </p>
                </div>,
              ]
            : []}
      </AnimatedPropertyGrid>
    </div>
  );
}
