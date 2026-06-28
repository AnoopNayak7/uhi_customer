"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const NearbyPlaces: any = dynamic(() => import("@/components/NearbyPlaces"), {
  ssr: false,
});

interface PropertyLocationProps {
  property: any;
}

export const PropertyLocation = ({ property }: PropertyLocationProps) => {
  return (
    <Card className="property-surface-warm">
      <CardContent className="relative p-5 sm:p-6">
        <p className="property-section-eyebrow-warm">Neighbourhood</p>
        <h3 className="property-section-title mb-5">location</h3>

        <div className="mb-4 flex items-start gap-3 rounded-[16px] border border-[#EBEBEB] bg-white p-4 shadow-sm">
          <div className="property-icon-pill">
            <MapPin className="size-4" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-manrope text-sm font-medium text-[#1A1A1A]">
              {property.address}
            </h4>
            <p className="mt-0.5 font-manrope text-sm text-[#5C5C5C]">
              {property.city}, {property.state}
            </p>
          </div>
        </div>

        <div className="mb-6 h-[300px] overflow-hidden rounded-[16px] border border-[#EBEBEB] bg-white shadow-sm">
          {property.location?.latitude && property.location?.longitude ? (
            <Map
              center={[property.location.latitude, property.location.longitude]}
              zoom={15}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#FAFAFA]">
              <p className="font-manrope text-sm text-[#5C5C5C]">
                Map location not available
              </p>
            </div>
          )}
        </div>

        {property.location?.latitude && property.location?.longitude ? (
          <NearbyPlaces
            latitude={property.location.latitude}
            longitude={property.location.longitude}
            propertyAddress={
              property.address
                ? `${property.address}, ${property.city}`
                : property.city
            }
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
