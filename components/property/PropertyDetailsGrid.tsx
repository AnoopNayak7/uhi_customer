"use client";

import { Bed, Bath, Square, Car, LandPlot } from "lucide-react";

interface PropertyDetailsGridProps {
  property: {
    bedrooms: number;
    bathrooms: number;
    area: string;
    parkingSpot?: number;
    totalArea?: string;
    areaUnit?: string;
    category?: string;
  };
}

const PropertyDetailsGrid = ({ property }: PropertyDetailsGridProps) => {
  const isPlot = property.category?.toLowerCase() === 'plot';
  
  const details = [
    ...(isPlot ? [] : [
      {
        icon: Bed,
        value: property.bedrooms,
        label: "bedrooms",
      },
      {
        icon: Bath,
        value: property.bathrooms,
        label: "bathrooms",
      },
      {
        icon: Car,
        value: property.parkingSpot || 1,
        label: "parking",
      },
    ]),
    {
      icon: Square,
      value: property.area,
      label: isPlot ? "plot area" : "built-up area",
    },
    {
      icon: LandPlot,
      value: `${property?.totalArea}`,
      label: "acers",
    },
  ];

  return (
    <div className="w-full py-4">
      <div className="flex flex-wrap gap-6 md:gap-8">
        {details.map((detail) => {
          const Icon = detail.icon;
          return (
            <div key={detail.label} className="flex items-center gap-2 min-w-0">
              <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-base font-medium text-gray-900">
                  {detail.value}
                </span>
                <span className="text-sm text-gray-600 truncate">
                  {detail.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyDetailsGrid;
