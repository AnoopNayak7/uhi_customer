"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocationData } from "@/hooks/use-location-data";
import { usePropertyStore } from "@/lib/store";
import { toast } from "sonner";
import {
  HomeCarouselControls,
  HomeSection,
  HomeSectionHeader,
  HomeViewAllButton,
} from "@/components/home/home-section";
import { HomePropertyCard } from "@/components/home/home-property-card";

export function TrendingProperties() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    trendingProperties: properties,
    loading,
    error,
    getLocationDisplay,
    refreshData,
  } = useLocationData();
  const {
    addToFavourites,
    favourites,
    addToCompare,
    removeFromCompare,
    compareList,
  } = usePropertyStore();

  const pageCount = Math.max(1, Math.ceil(properties.length / 4));
  const visibleProperties = properties.slice(
    currentSlide * 4,
    (currentSlide + 1) * 4
  );

  const toggleCompare = (property: any) => {
    const isInCompare = compareList.some((p) => p.id === property.id);
    if (isInCompare) {
      removeFromCompare(property.id);
      toast.success("Property removed from comparison");
      return;
    }
    if (compareList.length >= 3) {
      toast.error("You can compare maximum 3 properties");
      return;
    }
    addToCompare(property);
    toast.success("Property added to comparison");
  };

  if (loading) {
    return (
      <HomeSection className="bg-[#FAFAFA]">
        <HomeSectionHeader
          title="Trending properties"
          subtitle="Loading trending properties..."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse rounded-2xl border-[#DDDDDD]">
              <div className="m-2 h-[168px] rounded-xl bg-[#F0F0F0]" />
              <CardContent className="space-y-3 p-4">
                <div className="h-4 rounded bg-[#F0F0F0]" />
                <div className="h-3 rounded bg-[#F0F0F0]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </HomeSection>
    );
  }

  if (error) {
    return (
      <HomeSection className="bg-[#FAFAFA]">
        <div className="text-center">
          <HomeSectionHeader title="Trending properties" subtitle={error} />
          <Button
            onClick={refreshData}
            variant="outline"
            className="rounded-full border-[#DDDDDD]"
          >
            Try again
          </Button>
        </div>
      </HomeSection>
    );
  }

  if (!properties.length) {
    return (
      <HomeSection className="bg-[#FAFAFA]">
        <div className="text-center">
          <HomeSectionHeader
            title="Trending properties"
            subtitle="No trending properties available at the moment."
          />
          <Button asChild className="property-btn-pill bg-red-500 text-white hover:bg-red-600">
            <Link href="/properties">Browse all properties</Link>
          </Button>
        </div>
      </HomeSection>
    );
  }

  return (
    <HomeSection className="bg-[#FAFAFA]">
      <HomeSectionHeader
        eyebrow="Most viewed now"
        title="Trending properties"
        subtitle={`Most viewed and enquired properties in ${getLocationDisplay()}`}
        action={
          <HomeCarouselControls
            onPrev={() =>
              setCurrentSlide((prev) => (prev - 1 + pageCount) % pageCount)
            }
            onNext={() => setCurrentSlide((prev) => (prev + 1) % pageCount)}
            disabled={properties.length <= 4}
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {visibleProperties.map((property: any) => (
          <HomePropertyCard
            key={property.id}
            property={property}
            onFavourite={() => addToFavourites(property)}
            isFavourite={favourites.some((p) => p.id === property.id)}
            onCompare={() => toggleCompare(property)}
            isInCompare={compareList.some((p) => p.id === property.id)}
            useBlur
          />
        ))}
      </div>

      <HomeViewAllButton />
    </HomeSection>
  );
}
