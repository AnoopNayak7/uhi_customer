"use client";

import Link from "next/link";
import { ArrowRight, Crown, GitCompare, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DashboardEmptyState,
  DashboardSection,
} from "@/components/dashboard/dashboard-ui";
import { PropertyCard } from "@/components/propertyListing/PropertyCard";
import { getComparisonScore } from "@/components/compare/compare-utils";
import type { Property } from "@/lib/store";
import { cn } from "@/lib/utils";

function rankProperties(properties: Property[]) {
  return [...properties]
    .map((property) => ({
      property,
      score: getComparisonScore(property),
    }))
    .sort((a, b) => b.score - a.score);
}

function CompareRankBadge({
  variant,
  score,
}: {
  variant: "best" | "runner-up";
  score: number;
}) {
  const isBest = variant === "best";

  return (
    <div
      className={cn(
        "absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.08em] shadow-sm",
        isBest
          ? "bg-[#303030] text-white"
          : "border border-[#D0D0D0] bg-white text-[#484848]"
      )}
    >
      {isBest ? (
        <Crown className="size-2.5" strokeWidth={1.5} />
      ) : (
        <Medal className="size-2.5" strokeWidth={1.5} />
      )}
      {isBest ? "Best pick" : "Runner-up"}
      <span className="opacity-70">· {Math.round(score)}</span>
    </div>
  );
}

export function DashboardCompareSection({
  properties,
  onFavorite,
  isFavorite,
}: {
  properties: Property[];
  onFavorite?: (property: Property) => void;
  isFavorite?: (property: Property) => boolean;
}) {
  const ranked = rankProperties(properties);
  const best = ranked[0];
  const runnerUp = ranked[1];

  return (
    <DashboardSection
      title="Compare properties"
      subtitle={
        properties.length >= 2
          ? "Your top picks based on value, space, and amenities"
          : "Add properties to compare side by side"
      }
      action={
        properties.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-[#D0D0D0] font-manrope text-xs"
            asChild
          >
            <Link href="/tools/property-comparison">
              Full comparison
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        ) : null
      }
    >
      {properties.length >= 2 && best && runnerUp ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <div className="relative w-full max-w-[320px]">
              <CompareRankBadge variant="best" score={best.score} />
              <PropertyCard
                property={best.property}
                onFavorite={() => onFavorite?.(best.property)}
                isFavorite={isFavorite?.(best.property) ?? false}
                compact
              />
            </div>
            <div className="relative w-full max-w-[320px]">
              <CompareRankBadge variant="runner-up" score={runnerUp.score} />
              <PropertyCard
                property={runnerUp.property}
                onFavorite={() => onFavorite?.(runnerUp.property)}
                isFavorite={isFavorite?.(runnerUp.property) ?? false}
                compact
              />
            </div>
          </div>

          {ranked.length > 2 ? (
            <p className="font-manrope text-xs text-[#717171]">
              +{ranked.length - 2} more in your compare list ·{" "}
              <Link
                href="/tools/property-comparison"
                className="font-medium text-[#303030] underline-offset-2 hover:underline"
              >
                see full comparison
              </Link>
            </p>
          ) : null}
        </div>
      ) : properties.length === 1 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <div className="relative w-full max-w-[320px]">
              <CompareRankBadge
                variant="best"
                score={getComparisonScore(properties[0])}
              />
              <PropertyCard
                property={properties[0]}
                onFavorite={() => onFavorite?.(properties[0])}
                isFavorite={isFavorite?.(properties[0]) ?? false}
                compact
              />
            </div>
          </div>
          <p className="font-manrope text-sm text-[#717171]">
            Add one more property to see best vs runner-up picks.
          </p>
        </div>
      ) : (
        <DashboardEmptyState
          icon={GitCompare}
          title="Nothing to compare yet"
          description="Save up to 3 properties from listings and we'll highlight the best options here."
          actionHref="/properties"
          actionLabel="Find properties to compare"
        />
      )}
    </DashboardSection>
  );
}
