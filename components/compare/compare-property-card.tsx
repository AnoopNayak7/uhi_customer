"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, Eye, MapPin, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "./compare-utils";
import type { Property } from "@/lib/store";

interface ComparePropertyCardProps {
  property: Property;
  index: number;
  onRemove: () => void;
  isHovered?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  distance?: number | null;
}

export function ComparePropertyCard({
  property,
  index,
  onRemove,
  isHovered = false,
  onHoverStart,
  onHoverEnd,
  distance,
}: ComparePropertyCardProps) {
  return (
    <article
      className={`compare-surface overflow-hidden transition-all ${
        isHovered ? "ring-2 ring-[#303030]/20" : ""
      }`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div className="relative h-44 sm:h-48">
        <Image
          src={
            property.images?.[0] ||
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center"
          }
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/30 bg-white/90 text-[#484848] backdrop-blur-sm transition-colors hover:bg-white hover:text-[#C44]"
          aria-label="Remove from comparison"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>

        <span className="absolute left-3 top-3 rounded-full bg-[#303030] px-2.5 py-1 font-manrope text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
          Property {index + 1}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 font-manrope text-sm font-semibold text-white sm:text-base">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 font-manrope text-xs text-white/85">
            <MapPin className="size-3 shrink-0" strokeWidth={1.5} />
            <span className="line-clamp-1">
              {property.address}, {property.city}
            </span>
          </p>
          {distance != null && (
            <p className="mt-1 font-manrope text-[11px] text-white/75">
              {distance.toFixed(1)} km from you
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="text-center">
          <p className="font-manrope text-xl font-bold tracking-[-0.02em] text-[#1A1A1A]">
            {formatPrice(property.price)}
          </p>
          <p className="mt-0.5 font-manrope text-xs text-[#8A8A8A]">
            Starting price
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center rounded-[12px] border border-[#D0D0D0] bg-[#FAFAFA] px-2 py-2.5">
            <Bed className="mb-1 size-3.5 text-[#484848]" strokeWidth={1.5} />
            <span className="font-manrope text-xs font-semibold text-[#1A1A1A]">
              {property.bedrooms ?? "—"}
            </span>
            <span className="font-manrope text-[10px] text-[#8A8A8A]">BHK</span>
          </div>
          <div className="flex flex-col items-center rounded-[12px] border border-[#D0D0D0] bg-[#FAFAFA] px-2 py-2.5">
            <Bath className="mb-1 size-3.5 text-[#484848]" strokeWidth={1.5} />
            <span className="font-manrope text-xs font-semibold text-[#1A1A1A]">
              {property.bathrooms ?? "—"}
            </span>
            <span className="font-manrope text-[10px] text-[#8A8A8A]">Bath</span>
          </div>
          <div className="flex flex-col items-center rounded-[12px] border border-[#D0D0D0] bg-[#FAFAFA] px-2 py-2.5">
            <Square className="mb-1 size-3.5 text-[#484848]" strokeWidth={1.5} />
            <span className="font-manrope text-xs font-semibold text-[#1A1A1A]">
              {property.area ?? "—"}
            </span>
            <span className="font-manrope text-[10px] text-[#8A8A8A]">
              {property.areaUnit || "sqft"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="property-btn-pill h-10 w-full border-[#D0D0D0] font-manrope text-sm text-[#303030] hover:bg-[#FAFAFA]"
          asChild
        >
          <Link href={`/properties/${property.slug || property.id}`}>
            <Eye className="mr-2 size-4" strokeWidth={1.5} />
            View details
          </Link>
        </Button>
      </div>
    </article>
  );
}

interface CompareEmptySlotProps {
  slotNumber: number;
}

export function CompareEmptySlot({ slotNumber }: CompareEmptySlotProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#C4C4C4] bg-[#FAFAFA] p-6 text-center">
      <div className="property-icon-pill mb-3 !size-12">
        <span className="font-manrope text-sm font-semibold text-[#8A8A8A]">
          {slotNumber}
        </span>
      </div>
      <p className="font-manrope text-sm font-medium text-[#5C5C5C]">
        Empty slot
      </p>
      <p className="mt-1 max-w-[180px] font-manrope text-xs text-[#8A8A8A]">
        Search above or browse listings to add a property
      </p>
    </div>
  );
}
