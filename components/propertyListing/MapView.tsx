"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { HomePropertyCard } from "@/components/home/home-property-card";
import { usePropertyStore } from "@/lib/store";
import { MapTypeToggle } from "./properties-view-controls";
import { cn } from "@/lib/utils";

const MapComponent: any = dynamic(
  () => import("@/components/propertyListing/Map"),
  { ssr: false }
);

interface MapViewProps {
  properties: any[];
  mapMarkers?: any[];
  userLocation: [number, number] | null;
  mapType: "map" | "satellite";
  setMapType: (type: "map" | "satellite") => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  mobile?: boolean;
}

export function MapView({
  properties,
  mapMarkers = [],
  userLocation,
  mapType,
  setMapType,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  totalCount = 0,
  mobile = false,
}: MapViewProps) {
  const {
    favourites,
    compareList,
    addToFavourites,
    removeFromFavourites,
    addToCompare,
    removeFromCompare,
  } = usePropertyStore();
  const mapLoadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  const handleFavorite = (property: any) => {
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

  useEffect(() => {
    if (mobile) return;

    const scrollContainer = mapLoadMoreRef.current?.parentElement;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1, root: scrollContainer }
    );

    if (mapLoadMoreRef.current) {
      observer.observe(mapLoadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadingMore, onLoadMore, mobile, properties.length]);

  const propertiesWithCoordinates = properties.filter(
    (p) => p.latitude && p.longitude
  );

  const mapMarkerProperties =
    mapMarkers.length > 0 ? mapMarkers : propertiesWithCoordinates;

  const defaultCenter: [number, number] = [12.9716, 77.5946];

  const panelHeightClass =
    "h-[calc(100dvh-var(--properties-toolbar-height,11rem)-1.25rem)] min-h-[420px]";

  if (mobile) {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-[20px]",
          panelHeightClass
        )}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#F5F5F5]">
          <div className="absolute inset-0">
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[20] flex justify-end">
              <div className="pointer-events-auto shrink-0">
                <MapTypeToggle mapType={mapType} setMapType={setMapType} />
              </div>
            </div>
            <MapComponent
              center={userLocation || defaultCenter}
              zoom={13}
              properties={mapMarkerProperties}
              mapType={mapType}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 gap-4 overflow-hidden",
        panelHeightClass,
        "lg:flex-row"
      )}
    >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-[#F5F5F5]">
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute inset-x-3 top-3 z-[20] flex justify-end">
            <div className="pointer-events-auto shrink-0">
              <MapTypeToggle mapType={mapType} setMapType={setMapType} />
            </div>
          </div>
          <MapComponent
            center={userLocation || defaultCenter}
            zoom={13}
            properties={mapMarkerProperties}
            mapType={mapType}
          />
        </div>
      </div>

      <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-white lg:w-[22rem] xl:w-96">
        <div className="shrink-0 border-b border-[#F0F0F0] px-4 py-4">
          <p className="home-section-eyebrow mb-0">Results</p>
          <p className="mt-1 font-manrope text-sm text-[#5C5C5C]">
            {totalCount > 0
              ? `${totalCount} properties found`
              : `${propertiesWithCoordinates.length} properties found`}
            {mapMarkerProperties.length > 0 ? (
              <span className="text-[#949494]">
                {" "}
                · {mapMarkerProperties.length} on map
              </span>
            ) : null}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {propertiesWithCoordinates.length > 0 ? (
            <>
              <div className="space-y-4 p-3">
                {propertiesWithCoordinates.map((property) => (
                  <HomePropertyCard
                    key={property.id}
                    property={property}
                    onFavourite={() => handleFavorite(property)}
                    isFavourite={favourites.some((p) => p.id === property.id)}
                    onCompare={() => toggleCompare(property)}
                    isInCompare={compareList.some((p) => p.id === property.id)}
                  />
                ))}
              </div>

              <div
                ref={mapLoadMoreRef}
                className="flex h-10 items-center justify-center"
              >
                {loadingMore ? (
                  <div className="flex items-center space-x-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-[#EBEBEB] border-t-[#303030]" />
                    <span className="font-manrope text-sm text-[#5C5C5C]">
                      Loading more properties...
                    </span>
                  </div>
                ) : hasMore ? (
                  <span className="font-manrope text-sm text-[#5C5C5C]">
                    Scroll to load more
                  </span>
                ) : properties.length > 0 ? (
                  <span className="font-manrope text-sm text-[#5C5C5C]">
                    No more properties to load
                  </span>
                ) : null}
              </div>

              {hasMore && onLoadMore ? (
                <div className="border-t border-[#F0F0F0] p-4">
                  <Button
                    onClick={onLoadMore}
                    disabled={loadingMore}
                    className="property-btn-pill h-11 w-full rounded-full border-[#DDDDDD] bg-white font-manrope text-[#3A3A3A] hover:bg-[#FAFAFA]"
                    variant="outline"
                  >
                    {loadingMore ? "Loading..." : "Load more properties"}
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="font-manrope text-sm text-[#5C5C5C]">
                No properties with location data found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
