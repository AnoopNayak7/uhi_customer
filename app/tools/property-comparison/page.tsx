"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  GitCompare,
  Home,
  Loader2,
  Map as MapIcon,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/animations/layout-wrapper";
import { usePropertyStore } from "@/lib/store";
import { toast } from "sonner";
import { AddPropertySearch } from "@/components/compare/add-property-search";
import {
  CompareEmptySlot,
  ComparePropertyCard,
} from "@/components/compare/compare-property-card";
import { CompareTable } from "@/components/compare/compare-table";
import { CompareRecommendation } from "@/components/compare/compare-recommendation";
import { CompareLocationInsights } from "@/components/compare/compare-location-insights";
import { calculateDistance } from "@/components/compare/compare-utils";

const ComparisonMap = dynamic(() => import("@/components/ComparisonMap"), {
  ssr: false,
});

const MAX_COMPARE = 3;

export default function PropertyComparisonPage() {
  const { compareList, addToCompare, removeFromCompare, clearCompare } =
    usePropertyStore();
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
        toast.success("Location updated");
      },
      (error) => {
        const messages: Record<number, string> = {
          [error.PERMISSION_DENIED]: "Location access was denied",
          [error.POSITION_UNAVAILABLE]: "Location is unavailable",
          [error.TIMEOUT]: "Location request timed out",
        };
        setLocationError(messages[error.code] || "Unable to get your location");
        setLocationLoading(false);
        toast.error(messages[error.code] || "Unable to get your location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const getMapData = () => {
    if (compareList.length === 0) {
      return {
        center: userLocation
          ? ([userLocation.latitude, userLocation.longitude] as [number, number])
          : ([12.9716, 77.5946] as [number, number]),
        markers: [] as {
          id: string;
          position: [number, number];
          popupText: string;
        }[],
      };
    }

    const center: [number, number] = userLocation
      ? [userLocation.latitude, userLocation.longitude]
      : compareList.find((p) => p.latitude && p.longitude)
        ? [
            compareList.find((p) => p.latitude && p.longitude)!.latitude!,
            compareList.find((p) => p.latitude && p.longitude)!.longitude!,
          ]
        : [12.9716, 77.5946];

    const markers = compareList
      .filter((p) => p.latitude && p.longitude)
      .map((property) => {
        const distance = userLocation
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              property.latitude!,
              property.longitude!
            )
          : null;

        return {
          id: property.id,
          position: [property.latitude!, property.longitude!] as [number, number],
          popupText: `${property.title}${distance ? ` · ${distance.toFixed(1)} km` : ""}`,
        };
      });

    if (userLocation) {
      markers.push({
        id: "user-location",
        position: [userLocation.latitude, userLocation.longitude],
        popupText: "Your location",
      });
    }

    return { center, markers };
  };

  const mapData = getMapData();
  const emptySlots = Math.max(0, MAX_COMPARE - compareList.length);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1">
        <PageContent>
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:space-y-8 lg:py-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="font-manrope text-lg font-semibold tracking-[-0.01em] text-[#1A1A1A] sm:text-xl">
                  Compare properties
                </h1>
                <p className="mt-0.5 font-manrope text-sm text-[#717171]">
                  Add up to {MAX_COMPARE} properties side by side
                </p>
              </div>
              {compareList.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearCompare}
                  className="h-10 shrink-0 rounded-full border-[#D0D0D0] font-manrope text-sm text-[#484848] hover:bg-[#F5F5F5] hover:text-[#C44]"
                >
                  <Trash2 className="mr-2 size-4" strokeWidth={1.5} />
                  Clear all
                </Button>
              )}
            </div>

            {/* Add property search */}
            <div ref={searchRef}>
              <AddPropertySearch
                compareList={compareList}
                onAdd={addToCompare}
                maxItems={MAX_COMPARE}
              />
            </div>

            {!isHydrated ? (
              <div className="compare-surface flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="mb-4 size-8 animate-spin text-[#8A8A8A]" />
                <p className="font-manrope text-sm font-medium text-[#1A1A1A]">
                  Loading your comparison...
                </p>
              </div>
            ) : compareList.length === 0 ? (
              <div className="compare-surface px-6 py-14 text-center sm:px-10">
                <div className="property-icon-pill mx-auto mb-5 !size-16">
                  <GitCompare className="size-7 text-[#484848]" strokeWidth={1.5} />
                </div>
                <h2 className="property-section-title mb-3">
                  no properties yet
                </h2>
                <p className="mx-auto mb-8 max-w-md font-manrope text-sm leading-relaxed text-[#717171]">
                  Search above to add properties, or browse listings and tap the
                  compare icon on any property card.
                </p>
                <Button
                  className="property-btn-pill h-11 bg-[#303030] px-6 font-manrope text-sm text-white hover:bg-[#1a1a1a]"
                  asChild
                >
                  <Link href="/properties">
                    <Home className="mr-2 size-4" strokeWidth={1.5} />
                    Browse properties
                  </Link>
                </Button>

                <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
                  {[
                    {
                      icon: Search,
                      title: "Search",
                      text: "Find properties by name or area",
                    },
                    {
                      icon: Plus,
                      title: "Add",
                      text: "Add up to 3 to compare",
                    },
                    {
                      icon: GitCompare,
                      title: "Compare",
                      text: "Review specs side by side",
                    },
                  ].map((step) => (
                    <div
                      key={step.title}
                      className="rounded-[16px] border border-[#D0D0D0] bg-[#FAFAFA] p-4"
                    >
                      <div className="property-icon-pill mb-3 !size-9">
                        <step.icon className="size-4" strokeWidth={1.5} />
                      </div>
                      <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                        {step.title}
                      </p>
                      <p className="mt-1 font-manrope text-xs text-[#717171]">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 lg:space-y-8">
                {/* Property cards + empty slots */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                      Your selection ({compareList.length}/{MAX_COMPARE})
                    </p>
                    {compareList.length < MAX_COMPARE && (
                      <button
                        type="button"
                        onClick={() =>
                          searchRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          })
                        }
                        className="font-manrope text-xs font-medium text-[#303030] underline-offset-4 hover:underline"
                      >
                        + Add another
                      </button>
                    )}
                  </div>

                  {/* Mobile: horizontal scroll */}
                  <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
                    {compareList.map((property, index) => (
                      <div key={property.id} className="w-[300px] shrink-0">
                        <ComparePropertyCard
                          property={property}
                          index={index}
                          onRemove={() => removeFromCompare(property.id)}
                          isHovered={hoveredPropertyId === property.id}
                          onHoverStart={() => setHoveredPropertyId(property.id)}
                          onHoverEnd={() => setHoveredPropertyId(null)}
                          distance={
                            userLocation &&
                            property.latitude &&
                            property.longitude
                              ? calculateDistance(
                                  userLocation.latitude,
                                  userLocation.longitude,
                                  property.latitude,
                                  property.longitude
                                )
                              : null
                          }
                        />
                      </div>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-[300px] shrink-0">
                        <CompareEmptySlot slotNumber={compareList.length + i + 1} />
                      </div>
                    ))}
                  </div>

                  {/* Desktop: grid */}
                  <div className="hidden gap-5 md:grid md:grid-cols-3">
                    {compareList.map((property, index) => (
                      <ComparePropertyCard
                        key={property.id}
                        property={property}
                        index={index}
                        onRemove={() => removeFromCompare(property.id)}
                        isHovered={hoveredPropertyId === property.id}
                        onHoverStart={() => setHoveredPropertyId(property.id)}
                        onHoverEnd={() => setHoveredPropertyId(null)}
                        distance={
                          userLocation &&
                          property.latitude &&
                          property.longitude
                            ? calculateDistance(
                                userLocation.latitude,
                                userLocation.longitude,
                                property.latitude,
                                property.longitude
                              )
                            : null
                        }
                      />
                    ))}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <CompareEmptySlot
                        key={`empty-${i}`}
                        slotNumber={compareList.length + i + 1}
                      />
                    ))}
                  </div>
                </div>

                {/* Location prompt */}
                {!userLocation && (
                  <div className="compare-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="property-icon-pill shrink-0">
                        <MapPin className="size-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                          See distances from you
                        </p>
                        <p className="mt-0.5 font-manrope text-xs text-[#5C5C5C]">
                          Allow location access to compare how far each property
                          is from your current position.
                        </p>
                        {locationError && (
                          <p className="mt-2 font-manrope text-xs text-red-600">
                            {locationError}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={requestLocation}
                      disabled={locationLoading}
                      className="property-btn-pill h-10 shrink-0 bg-[#303030] px-5 font-manrope text-sm text-white hover:bg-[#1a1a1a]"
                    >
                      {locationLoading ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Getting location...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 size-4" strokeWidth={1.5} />
                          Use my location
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Map */}
                <div className="compare-surface overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-[#D8D8D8] px-5 py-4">
                    <div className="property-icon-pill">
                      <MapIcon className="size-4" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                        Property locations
                      </h3>
                      <p className="font-manrope text-xs text-[#5C5C5C]">
                        Hover a card to highlight its pin on the map
                      </p>
                    </div>
                  </div>
                  <div className="relative h-72 w-full sm:h-80">
                    <ComparisonMap
                      center={mapData.center}
                      zoom={12}
                      markers={mapData.markers}
                      hoveredPropertyId={hoveredPropertyId}
                    />
                  </div>
                </div>

                {userLocation && (
                  <CompareLocationInsights
                    properties={compareList}
                    userLocation={userLocation}
                  />
                )}

                <CompareTable properties={compareList} />

                <CompareRecommendation properties={compareList} />
              </div>
            )}
          </div>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
