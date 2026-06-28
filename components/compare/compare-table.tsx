"use client";

import { BarChart3 } from "lucide-react";
import { formatPrice } from "./compare-utils";
import type { Property } from "@/lib/store";

interface CompareTableProps {
  properties: Property[];
}

const comparisonFeatures = [
  {
    key: "price",
    label: "Price",
    format: (value: number) => formatPrice(value),
    compare: "lower" as const,
  },
  {
    key: "bedrooms",
    label: "Bedrooms",
    format: (value: number) => (value ? String(value) : "—"),
    compare: "higher" as const,
  },
  {
    key: "bathrooms",
    label: "Bathrooms",
    format: (value: number) => (value ? String(value) : "—"),
    compare: "higher" as const,
  },
  {
    key: "area",
    label: "Area",
    format: (value: number, property: Property) =>
      value ? `${value} ${property.areaUnit || "sqft"}` : "—",
    compare: "higher" as const,
  },
  {
    key: "category",
    label: "Property type",
    format: (value: string) => value || "—",
  },
  {
    key: "constructionStatus",
    label: "Status",
    format: (value: string) => value || "Ready to move",
  },
  {
    key: "furnishingStatus",
    label: "Furnishing",
    format: (value: string) => value || "—",
  },
];

function getPropertyValue(property: Property, key: string): unknown {
  return (property as unknown as Record<string, unknown>)[key];
}

function getBestIndex(
  properties: Property[],
  key: string,
  compare: "lower" | "higher"
) {
  const values = properties.map((p) => {
    const val = getPropertyValue(p, key);
    return typeof val === "number" ? val : null;
  });
  if (values.every((v) => v == null)) return -1;

  let bestIdx = 0;
  let bestVal = values[0] ?? (compare === "lower" ? Infinity : -Infinity);

  values.forEach((val, idx) => {
    if (val == null) return;
    if (compare === "lower" ? val < bestVal : val > bestVal) {
      bestVal = val;
      bestIdx = idx;
    }
  });

  return bestIdx;
}

export function CompareTable({ properties }: CompareTableProps) {
  return (
    <div className="compare-surface overflow-hidden">
      <div className="border-b border-[#D8D8D8] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="property-icon-pill">
            <BarChart3 className="size-4" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-manrope text-sm font-semibold text-[#1A1A1A] sm:text-base">
              Side-by-side comparison
            </h3>
            <p className="font-manrope text-xs text-[#5C5C5C]">
              Key specs across your selected properties
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#D8D8D8] bg-[#FAFAFA]">
              <th className="sticky left-0 z-10 bg-[#FAFAFA] px-4 py-3 text-left font-manrope text-xs font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] sm:px-6">
                Feature
              </th>
              {properties.map((property) => (
                <th
                  key={property.id}
                  className="min-w-[140px] px-4 py-3 text-center font-manrope text-xs font-semibold text-[#1A1A1A] sm:px-5"
                >
                  <span className="line-clamp-2">{property.title}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature) => {
              const bestIdx =
                "compare" in feature && feature.compare
                  ? getBestIndex(properties, feature.key, feature.compare)
                  : -1;

              return (
                <tr
                  key={feature.key}
                  className="border-b border-[#E0E0E0] last:border-b-0"
                >
                  <td className="sticky left-0 z-10 bg-white px-4 py-3.5 font-manrope text-sm font-medium text-[#5C5C5C] sm:px-6">
                    {feature.label}
                  </td>
                  {properties.map((property, idx) => {
                    const raw = getPropertyValue(property, feature.key);
                    const display = feature.format(
                      raw as never,
                      property as never
                    );
                    const isBest = bestIdx === idx && properties.length > 1;

                    return (
                      <td
                        key={property.id}
                        className={`px-4 py-3.5 text-center font-manrope text-sm sm:px-5 ${
                          isBest
                            ? "bg-[#F7FAF8] font-semibold text-[#1A1A1A]"
                            : "text-[#3A3A3A]"
                        }`}
                      >
                        {display}
                        {isBest && (
                          <span className="mt-0.5 block font-manrope text-[10px] font-medium uppercase tracking-[0.06em] text-[#3D6B4F]">
                            Best
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
