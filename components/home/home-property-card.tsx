"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bed, GitCompareArrows, Heart, MapPin, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginModal } from "@/components/ui/login-modal";
import { BLUR_DATA_URLS } from "@/lib/images";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

export interface HomePropertyCardData {
  id: string;
  slug?: string;
  title: string;
  price: number;
  address: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number | number[];
  areaUnit?: string;
  images?: string[];
  category?: string;
  bhkVariants?: string[];
  constructionStatus?: string;
}

function formatPrice(price: number) {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1).replace(/\.0$/, "")} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

function formatBhk(variants?: string[], bedrooms?: number) {
  if (variants?.length) {
    if (variants.length === 1) return variants[0];
    if (variants.length === 2) return variants.join(", ");

    const numbers = variants
      .map((variant) => parseInt(variant, 10))
      .filter((value) => !Number.isNaN(value));

    if (numbers.length >= 2) {
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      return min === max ? `${min} BHK` : `${min}–${max} BHK`;
    }

    return `${variants[0]} +${variants.length - 1}`;
  }

  if (bedrooms) return `${bedrooms} BHK`;
  return null;
}

function formatLocation(address: string, city: string, title: string) {
  const normalizedTitle = title.toLowerCase();
  const normalizedCity = city.toLowerCase();

  if (address) {
    if (normalizedCity && normalizedTitle.includes(normalizedCity)) {
      return address;
    }
    return city ? `${address}, ${city}` : address;
  }

  return city;
}

function formatPossession(status?: string) {
  if (status === "ready_to_move") return "Ready to move";
  if (status === "under_construction") return "Under construction";
  return status ? status.replace(/_/g, " ") : "Under construction";
}

export function HomePropertyCard({
  property,
  onFavourite,
  isFavourite,
  onCompare,
  isInCompare,
  defaultImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format&q=80",
  useBlur = false,
}: {
  property: HomePropertyCardData;
  onFavourite: () => void;
  isFavourite: boolean;
  onCompare: () => void;
  isInCompare: boolean;
  defaultImage?: string;
  useBlur?: boolean;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCardClick = () => {
    router.push(`/properties/${property.slug || property.id}`);
  };

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      await onFavourite();
    } catch {
      toast.error("Failed to update favourites. Please try again.");
    }
  };

  const areaValue = Array.isArray(property.area)
    ? property.area[0]
    : property.area;
  const bhkLabel = formatBhk(property.bhkVariants, property.bedrooms);
  const locationLabel = formatLocation(
    property.address,
    property.city,
    property.title
  );
  const isPlot = property.category?.toLowerCase() === "plot";

  return (
    <>
      <Card
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#DDDDDD] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        onClick={handleCardClick}
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-[#F5F5F5]">
          <Image
            src={property.images?.[0] || defaultImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 25vw"
            {...(useBlur
              ? { placeholder: "blur" as const, blurDataURL: BLUR_DATA_URLS.property }
              : {})}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="home-card-badge">
              {property.category?.toUpperCase() || "APARTMENT"}
            </span>

            <div className="liquid-glass-cluster liquid-glass-cluster--compact">
              <button
                type="button"
                aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
                className={`liquid-glass-action ${
                  isInCompare ? "liquid-glass-action-active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare();
                }}
              >
                <GitCompareArrows
                  className={`size-2.5 ${isInCompare ? "fill-current" : ""}`}
                  strokeWidth={1}
                />
              </button>
              <span className="liquid-glass-divider" />
              <button
                type="button"
                aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                className={`liquid-glass-action ${
                  isFavourite ? "liquid-glass-action-favourite" : ""
                }`}
                onClick={handleFavouriteClick}
              >
                <Heart
                  className={`size-2.5 ${
                    isFavourite ? "fill-red-500 text-red-500" : ""
                  }`}
                  strokeWidth={isFavourite ? 0 : 1}
                />
              </button>
            </div>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-4">
          <div className="min-h-[4.5rem]">
            <h3 className="line-clamp-2 font-manrope text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#222222]">
              {property.title}
            </h3>

            <div className="mt-2 flex items-start gap-1.5 text-[#5C5C5C]">
              <MapPin className="mt-0.5 size-2.5 shrink-0" strokeWidth={1} />
              <span className="line-clamp-2 font-manrope text-xs leading-relaxed">
                {locationLabel}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 font-manrope text-[13px] text-[#3A3A3A]">
            {!isPlot && bhkLabel ? (
              <div className="flex min-w-0 items-center gap-1.5">
                <Bed className="size-2.5 shrink-0 text-[#949494]" strokeWidth={1} />
                <span className="truncate">{bhkLabel}</span>
              </div>
            ) : null}
            {areaValue ? (
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <Square className="size-2.5 shrink-0 text-[#949494]" strokeWidth={1} />
                <span>
                  {areaValue} {property.areaUnit || "sqft"}
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#F0F0F0] pt-3.5">
            <div className="min-w-0">
              <p className="home-card-label">Starting price</p>
              <p className="mt-1 font-manrope text-[17px] font-semibold tracking-[-0.02em] text-[#222222]">
                {formatPrice(property.price)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="home-card-label">Possession</p>
              <p className="mt-1 font-manrope text-[13px] font-medium text-[#3A3A3A]">
                {formatPossession(property.constructionStatus)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => router.push("/auth/login")}
      />
    </>
  );
}
