"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Home, Building2, Store } from "lucide-react";
import {
  PROPERTY_TYPES,
  CITIES,
  BHK_OPTIONS,
  PROPERTY_CATEGORIES,
} from "@/lib/config";
import { useRouter } from "next/navigation";
import { useSearchStore, useLocationStore } from "@/lib/store";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";
import { ButtonAnimation } from "@/components/animations/page-transitions";
import { useGTMHeroBackground } from "@/hooks/use-gtm";

export function HeroSection() {
  const router = useRouter();
  const { updateSearchFilters } = useSearchStore();
  const { setSelectedLocation } = useLocationStore();
  const [searchForm, setSearchForm] = useState({
    type: "sell",
    city: "Bengaluru", // Set Bengaluru as default
    area: "",
    bhk: "",
    propertyCategory: "",
  });

  const handleSearch = () => {
    try {
      console.log("Search form data:", searchForm); // Debug log

      const params: any = new URLSearchParams();
      Object.entries(searchForm).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
          console.log(`Adding param: ${key} = ${value}`); // Debug log
        }
      });

      // Update search filters
      updateSearchFilters({
        type: searchForm.type,
        city: searchForm.city,
        area: searchForm.area, // This will be used for location filtering
        bedrooms: searchForm.bhk,
        propertyCategory: searchForm.propertyCategory,
      });

      // Update selected location for location-based filtering only when search is clicked
      if (searchForm.city) {
        setSelectedLocation({
          city: searchForm.city,
          area: searchForm.area || undefined,
        });
      }

      const searchUrl = `/properties?${params.toString()}`;
      console.log("Navigating to:", searchUrl); // Debug log

      // Navigate to properties page
      router.push(searchUrl);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback navigation
      const searchUrl = `/properties?type=${searchForm.type}&city=${searchForm.city}`;
      window.location.href = searchUrl;
    }
  };

  // Handle city selection change
  const handleCityChange = (city: string) => {
    setSearchForm((prev) => ({ ...prev, city }));

    // Immediately update location when city changes

    // Update location when city changes (this will trigger API calls for the new city)
    if (city) {
      setSelectedLocation({
        city,
        area: undefined, // Reset area when city changes to avoid mixed data
      });
    }
  };

  // Handle location input change - don't update location immediately
  const handleLocationChange = (area: string) => {
    setSearchForm((prev) => ({ ...prev, area }));
    // Removed automatic location update to prevent API calls while typing
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "sell":
        return <Home className="w-4 h-4" />;
      case "rent":
        return <Building2 className="w-4 h-4" />;
      case "commercial":
        return <Store className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  const heroBackground = useGTMHeroBackground();

  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-20">
      {/* CRED-style vertical lines + soft top glow */}
      <div
        aria-hidden
        className="hero-cred-background pointer-events-none absolute inset-0 z-[1]"
      />

      {/* Hero Background Image from GTM */}
      {heroBackground?.enabled && heroBackground?.imageUrl && (
        <div
          className="absolute inset-0 z-[2]"
          style={{
            opacity: heroBackground.opacity || 0.15,
            backgroundImage: `url(${heroBackground.imageUrl})`,
            backgroundSize: heroBackground.position || "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-white/85" />
        </div>
      )}

      {/* Property Tag Badge - Floating */}
      {heroBackground?.enabled && heroBackground?.tag && (
        <div className="absolute top-4 right-4 z-10 md:top-8 md:right-8">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground border-0 shadow-lg px-4 py-2 text-sm font-semibold"
          >
            {heroBackground.tag}
          </Badge>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="text-center mb-12">
          <StaggerItem>
            <div className="flex items-center justify-center mb-4">
          <Badge
            variant="outline"
            className="rounded-full border-amber-200 bg-amber-50 px-4 py-2 font-manrope text-amber-800"
          >
            <Star className="mr-2 size-3 fill-amber-500 text-amber-500" />
            Trusted by 470+ customers
          </Badge>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mb-6 font-manrope text-4xl font-bold tracking-[-0.03em] text-[#222222] md:text-6xl">
              Find your
              <span className="mt-1 block text-red-500">dream home</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mb-8 max-w-2xl font-manrope text-lg text-[#717171]">
              Discover exceptional properties with our AI-powered search. Your
              perfect home is just a few clicks away.
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Modern Search Bar */}
        <MotionWrapper variant="slideInUp" delay={0.4}>
          <div className="max-w-4xl mx-auto">
            {/* Property Type Tabs - Horizontal Design */}
            <div className="flex justify-center mb-6">
              <div className="property-surface flex p-1">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      setSearchForm((prev) => ({
                        ...prev,
                        type: type.value,
                      }))
                    }
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-manrope text-sm font-medium transition-all duration-200 ${
                      searchForm.type === type.value
                        ? "bg-[#303030] text-white"
                        : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
                    }`}
                  >
                    {getPropertyTypeIcon(type.value)}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Airbnb-style Search Bar */}
            <Card className="property-surface rounded-[24px] p-2 shadow-none hero-search">
              <div className="flex items-center gap-1 p-1">
                {/* City Selection */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Select
                      value={searchForm.city}
                      onValueChange={handleCityChange}
                      disabled
                    >
                      <SelectTrigger className="h-14 pl-12 pr-4 bg-transparent border-0 hover:bg-gray-50 rounded-xl text-left focus:ring-0 focus:border focus:border-gray-300 search-trigger">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 mx-2" />

                {/* Location Search */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Location, landmark, project..."
                      value={searchForm.area}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="h-14 pl-12 pr-4 bg-transparent border-0 hover:bg-gray-50 rounded-xl placeholder:text-gray-500 focus:ring-0 focus:border focus:border-gray-300 search-input"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 mx-2" />

                {/* BHK Selection */}
                <div className="flex-1 min-w-0">
                  <Select
                    value={searchForm.bhk}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({ ...prev, bhk: value }))
                    }
                  >
                    <SelectTrigger className="h-14 px-4 bg-transparent border-0 hover:bg-gray-50 rounded-xl text-left focus:ring-0 focus:border focus:border-gray-300 search-trigger">
                      <SelectValue placeholder="BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {BHK_OPTIONS.map((bhk) => (
                        <SelectItem key={bhk.value} value={bhk.value}>
                          {bhk.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 mx-2" />

                {/* Property Type */}
                <div className="flex-1 min-w-0">
                  <Select
                    value={searchForm.propertyCategory}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        propertyCategory: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-14 px-4 bg-transparent border-0 hover:bg-gray-50 rounded-xl text-left focus:ring-0 focus:border focus:border-gray-300 search-trigger">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <ButtonAnimation>
                  <Button
                    onClick={handleSearch}
                    className="property-btn-pill size-14 shrink-0 bg-red-500 p-0 text-white hover:bg-red-600"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </ButtonAnimation>
              </div>
            </Card>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
