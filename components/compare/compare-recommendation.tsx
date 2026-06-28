"use client";

import Link from "next/link";
import { ArrowRight, Crown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "./compare-utils";
import type { Property } from "@/lib/store";

export function CompareRecommendation({ properties }: { properties: Property[] }) {
  if (properties.length < 2) return null;

  const bestProperty = properties.reduce((best, current) => {
    const bestArea = best.area || 1;
    const currentArea = current.area || 1;
    const bestScore =
      (best.features?.length || 0) * 10 - (best.price || 0) / bestArea;
    const currentScore =
      (current.features?.length || 0) * 10 -
      (current.price || 0) / currentArea;
    return currentScore > bestScore ? current : best;
  });

  return (
    <div className="compare-surface overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
        <div className="property-icon-pill !size-12 shrink-0 bg-[#303030] !text-white">
          <Crown className="size-5" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="property-section-eyebrow mb-1 !text-[#8A8A8A]">
            Our pick
          </p>
          <h3 className="property-section-title !text-xl sm:!text-2xl">
            best value for money
          </h3>
          <p className="mt-2 font-manrope text-sm text-[#5C5C5C]">
            Based on price per sq.ft, amenities, and overall specs.
          </p>

          <div className="mt-5 rounded-[16px] border border-[#D0D0D0] bg-[#FAFAFA] p-4 sm:p-5">
            <h4 className="font-manrope text-base font-semibold text-[#1A1A1A]">
              {bestProperty.title}
            </h4>
            <p className="mt-1 flex items-center gap-1.5 font-manrope text-sm text-[#5C5C5C]">
              <MapPin className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span className="line-clamp-1">
                {bestProperty.address}, {bestProperty.city}
              </span>
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-manrope text-xl font-bold tracking-[-0.02em] text-[#1A1A1A]">
                {formatPrice(bestProperty.price)}
              </p>
              <Button
                className="property-btn-pill h-10 bg-[#303030] px-5 font-manrope text-sm text-white hover:bg-[#1a1a1a]"
                asChild
              >
                <Link
                  href={`/properties/${bestProperty.slug || bestProperty.id}`}
                >
                  View property
                  <ArrowRight className="ml-2 size-4" strokeWidth={1.5} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
