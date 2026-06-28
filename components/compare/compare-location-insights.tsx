"use client";

import { CheckCircle, MapPin, TrendingUp } from "lucide-react";
import { calculateDistance } from "./compare-utils";
import type { Property } from "@/lib/store";

interface CompareLocationInsightsProps {
  properties: Property[];
  userLocation: { latitude: number; longitude: number };
}

export function CompareLocationInsights({
  properties,
  userLocation,
}: CompareLocationInsightsProps) {
  const propertiesWithDistance = properties
    .filter((property) => property.latitude && property.longitude)
    .map((property) => ({
      ...property,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        property.latitude!,
        property.longitude!
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  if (propertiesWithDistance.length === 0) return null;

  const averageDistance =
    propertiesWithDistance.reduce((sum, p) => sum + p.distance, 0) /
    propertiesWithDistance.length;
  const closest = propertiesWithDistance[0];
  const farthest = propertiesWithDistance[propertiesWithDistance.length - 1];

  return (
    <div className="compare-surface overflow-hidden">
      <div className="border-b border-[#D8D8D8] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="property-icon-pill">
            <MapPin className="size-4" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-manrope text-sm font-semibold text-[#1A1A1A]">
              Distance from you
            </h3>
            <p className="font-manrope text-xs text-[#5C5C5C]">
              How far each property is from your current location
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
        <div className="rounded-[14px] border border-[#D0D0D0] bg-[#FAFAFA] p-4 text-center">
          <TrendingUp className="mx-auto mb-2 size-4 text-[#484848]" strokeWidth={1.5} />
          <p className="font-manrope text-lg font-bold text-[#1A1A1A]">
            {averageDistance.toFixed(1)} km
          </p>
          <p className="font-manrope text-xs text-[#8A8A8A]">Average</p>
        </div>
        <div className="rounded-[14px] border border-[#B8CFC0] bg-[#F7FAF8] p-4 text-center">
          <CheckCircle className="mx-auto mb-2 size-4 text-[#3D6B4F]" strokeWidth={1.5} />
          <p className="font-manrope text-lg font-bold text-[#1A1A1A]">
            {closest.distance.toFixed(1)} km
          </p>
          <p className="line-clamp-1 font-manrope text-xs text-[#5C5C5C]">
            Closest · {closest.title}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#D0D0D0] bg-[#FAFAFA] p-4 text-center">
          <MapPin className="mx-auto mb-2 size-4 text-[#484848]" strokeWidth={1.5} />
          <p className="font-manrope text-lg font-bold text-[#1A1A1A]">
            {farthest.distance.toFixed(1)} km
          </p>
          <p className="line-clamp-1 font-manrope text-xs text-[#5C5C5C]">
            Farthest · {farthest.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 border-t border-[#D8D8D8] px-5 py-4">
        {propertiesWithDistance.map((property, index) => (
          <div
            key={property.id}
            className="flex items-center justify-between rounded-[10px] bg-[#FAFAFA] px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={`size-2 shrink-0 rounded-full ${
                  index === 0
                    ? "bg-[#3D6B4F]"
                    : index === propertiesWithDistance.length - 1
                      ? "bg-[#C4A574]"
                      : "bg-[#8A8A8A]"
                }`}
              />
              <span className="truncate font-manrope text-sm text-[#3A3A3A]">
                {property.title}
              </span>
            </div>
            <span className="shrink-0 font-manrope text-xs font-semibold text-[#5C5C5C]">
              {property.distance.toFixed(1)} km
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
