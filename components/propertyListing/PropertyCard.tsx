"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Bed, Bath, Square, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CardHover } from "@/components/animations/page-transitions";
import { motion } from "framer-motion";
import { PropertyImage } from "@/components/ui/optimized-image";
import { PROPERTY_IMAGES, BLUR_DATA_URLS } from "@/lib/images";
import { usePropertyStore } from "@/lib/store";
import { toast } from "sonner";

// Helper function to format price
const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString()}`;
};

// Property Card Skeleton Component
export const PropertyCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white">
      <div className="flex flex-col">
        <div className="relative">
          <Skeleton className="h-48 sm:h-52 w-full" />
        </div>
        <CardContent className="p-4 sm:p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-px w-full mb-4" />
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export const PropertyCard = ({
  property,
  onFavorite,
  isFavorite,
  compact = false,
}: {
  property: any;
  onFavorite: () => void;
  isFavorite: boolean;
  compact?: boolean;
}) => {
  const router = useRouter();
  const { addToCompare, removeFromCompare, compareList } = usePropertyStore();

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite();
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isInCompare = compareList.some((p) => p.id === property.id);

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
  };

  const defaultImage = PROPERTY_IMAGES.default;

  return (
    <CardHover>
      <Card
        className="group overflow-hidden cursor-pointer bg-white touch-manipulation"
        onClick={handleCardClick}
      >
        <div className="flex flex-col">
          <div className="relative">
            <div
              className={`relative ${
                compact ? "h-[200px] sm:h-[160px]" : "h-48 sm:h-52"
              } overflow-hidden`}
            >
              <PropertyImage
                src={property.images?.[0] || defaultImage}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                blurDataURL={BLUR_DATA_URLS.property}
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* <div className="absolute top-3 left-3">
            <Badge className="bg-green-500 text-white border-0 text-xs font-normal">
              Available
            </Badge>
          </div> */}

            <div className="absolute top-3 right-3 flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-10 w-10 sm:h-8 sm:w-8 p-0 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30 ${
                    compareList.some((p) => p.id === property.id)
                      ? "text-blue-500"
                      : "text-white hover:text-blue-500"
                  }`}
                  onClick={handleCompareClick}
                >
                  <BarChart3
                    className={`w-5 h-5 sm:w-4 sm:h-4 ${
                      compareList.some((p) => p.id === property.id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-10 w-10 sm:h-8 sm:w-8 p-0 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30 ${
                    isFavorite
                      ? "text-red-500"
                      : "text-white hover:text-red-500"
                  }`}
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={`w-5 h-5 sm:w-4 sm:h-4 ${
                      isFavorite ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </motion.div>
            </div>
          </div>

          <CardContent className="p-4 sm:p-3">
            <div className="mb-4 sm:mb-5">
              <h3
                className={`font-semibold text-gray-900 line-clamp-2 mb-1 ${
                  compact ? "text-lg sm:text-base" : "text-lg sm:text-[18px]"
                }`}
              >
                {property.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm sm:text-xs mt-2">
                <MapPin className="w-4 h-4 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">
                  {property.address}, {property.city}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm sm:text-xs text-gray-600 mb-4 mt-3 gap-2">
              <div className="flex items-center min-w-0">
                <Bed className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{property.bedrooms} Bed</span>
              </div>
              <div className="flex items-center min-w-0">
                <Bath className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{property.bathrooms} Bath</span>
              </div>
              <div className="flex items-center min-w-0">
                <Square className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {property.area} {property.areaUnit}
                </span>
              </div>
            </div>

            <hr className="mb-2" />

            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  STARTING PRICE
                </div>
                <div className="text-xl sm:text-lg font-medium text-gray-900 truncate">
                  {formatPrice(property.price)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  POSSESSION
                </div>
                <div className="text-sm font-normal text-gray-900">
                  {property.possessionDate || "Ready to Move"}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </CardHover>
  );
};
