"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { apiClient } from "@/lib/api";
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

export function ProminentProjects() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prominentProperties, setProminentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getLocationDisplay } = useLocationData();
  const {
    addToFavourites,
    favourites,
    addToCompare,
    removeFromCompare,
    compareList,
  } = usePropertyStore();

  useEffect(() => {
    const fetchProminentProperties = async () => {
      try {
        setLoading(true);
        const response: any = await apiClient.getProperties({
          isProminent: true,
          status: "approved",
          limit: 20,
        });
        if (response.success) {
          setProminentProperties(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching prominent properties:", error);
        setProminentProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProminentProperties();
  }, []);

  const pageCount = Math.max(1, Math.ceil(prominentProperties.length / 4));
  const visibleProperties = prominentProperties.slice(
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
      <HomeSection>
        <HomeSectionHeader
          title={`Prominent projects in ${getLocationDisplay()}`}
          subtitle="Loading prominent projects..."
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

  if (!prominentProperties.length) {
    return (
      <HomeSection>
        <div className="property-surface mx-auto max-w-xl p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#F7F7F7]">
            <Flame className="size-5 text-[#717171]" />
          </div>
          <HomeSectionHeader
            title={`Prominent projects in ${getLocationDisplay()}`}
            subtitle="We're currently featuring our most sought-after projects. Check back soon."
          />
          <Button asChild className="property-btn-pill bg-[#303030] text-white hover:bg-[#1a1a1a]">
            <Link href="/properties">Browse all properties</Link>
          </Button>
        </div>
      </HomeSection>
    );
  }

  return (
    <HomeSection>
      <HomeSectionHeader
        eyebrow="Most sought-after"
        title={`Prominent projects in ${getLocationDisplay()}`}
        subtitle="Discover our most sought-after and hot-selling real estate projects"
        action={
          prominentProperties.length > 4 ? (
            <HomeCarouselControls
              onPrev={() =>
                setCurrentSlide((prev) => (prev - 1 + pageCount) % pageCount)
              }
              onNext={() => setCurrentSlide((prev) => (prev + 1) % pageCount)}
              disabled={prominentProperties.length <= 4}
            />
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {visibleProperties.map((property) => (
          <HomePropertyCard
            key={property.id}
            property={property}
            onFavourite={() => addToFavourites(property)}
            isFavourite={favourites.some((p) => p.id === property.id)}
            onCompare={() => toggleCompare(property)}
            isInCompare={compareList.some((p) => p.id === property.id)}
          />
        ))}
      </div>

      <HomeViewAllButton />
    </HomeSection>
  );
}
