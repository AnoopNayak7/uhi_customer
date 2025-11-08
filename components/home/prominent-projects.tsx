"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Bath,
  Bed,
  Square,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Star,
  Flame,
  GitCompareArrows,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { usePropertyStore, useAuthStore } from "@/lib/store";
import { useLocationData } from "@/hooks/use-location-data";
import { toast } from "sonner";

interface Property {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  propertyType?: string;
  address: string;
  city: string;
  state?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  images?: string[];
  features?: string[];
  category?: string;
  constructionStatus?: string;
  furnishingStatus?: string;
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isProminent?: boolean;
  isHotSelling?: boolean;
  bhkVariants?: string[];
}

export function ProminentProjects() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prominentProperties, setProminentProperties] = useState<Property[]>(
    []
  );
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
        // Use the getProperties method with filters for prominent properties only
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
        // Fallback to empty array
        setProminentProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProminentProperties();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `INR ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `INR ${(price / 100000).toFixed(1)} L`;
    }
    return `INR ${price.toLocaleString()}`;
  };

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(prominentProperties.length / 4)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(prominentProperties.length / 4)) %
        Math.ceil(prominentProperties.length / 4)
    );
  };

  const visibleProperties = prominentProperties.slice(
    currentSlide * 4,
    (currentSlide + 1) * 4
  );

  // Show loading skeleton
  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (prominentProperties.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-3">
              Prominent Projects in {getLocationDisplay()}
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              We&apos;re currently identifying and featuring our most prominent
              and hot-selling projects. Check back soon for exclusive property
              highlights!
            </p>
            <div className="space-y-3">
              <Button asChild>
                <Link href="/properties">Browse All Properties</Link>
              </Button>
              <p className="text-xs text-gray-400">
                New prominent projects being added regularly
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show properties
  return (
    <section className="py-12 sm:px-[8%] bg-white">
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Prominent Projects in {getLocationDisplay()}
            </h2>
            <p className="text-gray-500 text-sm">
              Discover our most sought-after and hot-selling real estate
              projects
            </p>
          </div>

          {prominentProperties.length > 4 && (
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={prominentProperties.length <= 4}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={prominentProperties.length <= 4}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {visibleProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleProperties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavourite={() => addToFavourites(property)}
                isFavourite={favourites.some((p) => p.id === property.id)}
                onCompare={() => {
                  const isInCompare = compareList.some(
                    (p) => p.id === property.id
                  );
                  if (isInCompare) {
                    removeFromCompare(property.id);
                    toast.success("Property removed from comparison");
                  } else {
                    if (compareList.length >= 3) {
                      toast.error("You can compare maximum 3 properties");
                      return;
                    }
                    addToCompare(property);
                    toast.success("Property added to comparison");
                  }
                }}
                isInCompare={compareList.some((p) => p.id === property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No properties to display</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/properties">View All Properties</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({
  property,
  onFavourite,
  isFavourite,
  onCompare,
  isInCompare,
}: {
  property: Property;
  onFavourite: () => void;
  isFavourite: boolean;
  onCompare: () => void;
  isInCompare: boolean;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const defaultImage = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Property+Image`;

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `INR ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `INR ${(price / 100000).toFixed(1)} L`;
    }
    return `INR ${price.toLocaleString()}`;
  };

  const handleCardClick = () => {
    const slug = property.slug || property.id;
    router.push(`/properties/${slug}`);
  };

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add properties to favourites");
      return;
    }

    try {
      await onFavourite();
    } catch (error) {
      toast.error("Failed to update favourites. Please try again.");
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare();
  };

  return (
    <Card
      className="cursor-pointer bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden rounded-lg"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="relative h-[160px] overflow-hidden m-[4px] rounded-t-md">
          <Image
            src={property.images?.[0] || defaultImage}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-700 border-0 text-[10px] font-normal px-2 py-1 rounded shadow-sm">
            {property.category?.toUpperCase() || "APARTMENTS"}
          </Badge>
        </div>

        {/* Prominent/Hot Selling Badge */}
        {/* <div className="absolute top-3 right-3">
          {property.isProminent && (
            <Badge className="bg-blue-500 text-white text-[10px] font-normal px-2 py-1 rounded shadow-sm mr-2">
              <Star className="w-3 h-3 mr-1" />
              PROMINENT
            </Badge>
          )}
          {property.isHotSelling && (
            <Badge className="bg-red-500 text-white text-[10px] font-normal px-2 py-1 rounded shadow-sm">
              <Flame className="w-3 h-3 mr-1" />
              HOT SELLING
            </Badge>
          )}
        </div> */}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white transition-colors ${
              isInCompare
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={handleCompareClick}
          >
            <GitCompareArrows
              className={`w-4 h-4 ${isInCompare ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white transition-colors ${
              isFavourite ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            onClick={handleFavouriteClick}
          >
            <Heart className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-500 text-xs mb-4">
            <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
            <span className="truncate">
              {property.address}, {property.city}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          {property.category?.toLowerCase() !== "plot" && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>
                {property.bhkVariants && property.bhkVariants.length > 0
                  ? property.bhkVariants.join(", ")
                  : `${property.bedrooms},${property.bathrooms}`}
              </span>
            </div>
          )}
          <div className="flex items-center">
            <Square className="w-3 h-3 mr-1" />
            <span className="text-[13px]">
              {Array.isArray(property.area) ? property.area[0] : property.area}{" "}
              {property.areaUnit}
            </span>
          </div>
        </div>

        <hr />
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              STARTING PRICE
            </div>
            <div className="text-lg font-medium text-gray-900">
              {formatPrice(property.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              POSSESSION
            </div>
            <div className="text-sm font-normal text-gray-900">
              {property.constructionStatus === "ready_to_move"
                ? "Ready to Move"
                : "Under Construction"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
