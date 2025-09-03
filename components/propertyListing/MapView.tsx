"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { PropertyCard } from "./PropertyCard";
import { usePropertyStore } from "@/lib/store";

// Import Map component dynamically to avoid SSR issues
const MapComponent: any = dynamic(
  () => import("@/components/propertyListing/Map"),
  { ssr: false }
);

interface MapViewProps {
  properties: any[];
  userLocation: [number, number] | null;
  mapType: "map" | "satellite";
  setMapType: (type: "map" | "satellite") => void;
}

export function MapView({
  properties,
  userLocation,
  mapType,
  setMapType,
}: MapViewProps) {
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

  // Filter properties with valid coordinates
  const propertiesWithCoordinates = properties.filter(
    (p) => p.latitude && p.longitude
  );

  // Default center (Bengaluru)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
      {/* Map */}
      <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
        <div className="relative h-full">
          <div className="absolute top-2 right-2 z-10 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white shadow-sm text-xs sm:text-sm h-8 sm:h-auto px-2 sm:px-3"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Bengaluru</span>
              <span className="sm:hidden">BLR</span>
            </Button>
            <div className="flex rounded-md overflow-hidden border border-gray-200 shadow-sm">
              <Button
                variant={mapType === "map" ? "default" : "outline"}
                size="sm"
                className="rounded-none text-xs sm:text-sm h-8 sm:h-auto px-2 sm:px-3"
                onClick={() => setMapType("map")}
              >
                Map
              </Button>
              <Button
                variant={mapType === "satellite" ? "default" : "outline"}
                size="sm"
                className="rounded-none text-xs sm:text-sm h-8 sm:h-auto px-2 sm:px-3"
                onClick={() => setMapType("satellite")}
              >
                Satellite
              </Button>
            </div>
          </div>

          <MapComponent
            center={userLocation || defaultCenter}
            zoom={13}
            properties={propertiesWithCoordinates}
            mapType={mapType}
          />
        </div>
      </div>

      {/* Property list */}
      <div className="w-full lg:w-96 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 sm:p-4 border-b flex-shrink-0">
          <h3 className="font-medium text-base sm:text-base">Properties</h3>
          <p className="text-sm text-gray-500">
            {propertiesWithCoordinates.length} properties found
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {propertiesWithCoordinates.length > 0 ? (
            propertiesWithCoordinates.map((property) => (
              <div
                key={property.id}
                className="p-2 sm:p-2 border-b last:border-b-0"
              >
                <PropertyCard
                  property={property}
                  onFavorite={() => handleFavorite(property)}
                  isFavorite={favourites.some((p) => p.id === property.id)}
                  compact
                />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No properties with location data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
