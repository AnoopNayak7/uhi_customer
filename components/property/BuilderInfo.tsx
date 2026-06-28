"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award, Building2, MapPin, Users } from "lucide-react";

interface BuilderInfoProps {
  property: any;
}

export const BuilderInfo = ({ property }: BuilderInfoProps) => {
  const developer = property?.developer;

  if (!developer || typeof developer !== "object") {
    return null;
  }

  if (!developer.name || !developer.id) {
    return null;
  }

  const getYearsOfExperience = () => {
    if (
      !developer?.yearEstablished ||
      typeof developer.yearEstablished !== "number"
    ) {
      return "N/A";
    }
    const years = new Date().getFullYear() - developer.yearEstablished;
    return `${years}+ years`;
  };

  const getOperatingCitiesCount = () => {
    if (
      !developer?.operatingCities ||
      !Array.isArray(developer.operatingCities) ||
      developer.operatingCities.length === 0
    ) {
      return "N/A";
    }
    return `${developer.operatingCities.length}+ cities`;
  };

  const getOperatingCitiesDisplay = () => {
    if (
      !developer?.operatingCities ||
      !Array.isArray(developer.operatingCities) ||
      developer.operatingCities.length === 0
    ) {
      return null;
    }

    const validCities = developer.operatingCities.filter(
      (city: unknown) => typeof city === "string"
    );
    if (validCities.length === 0) return null;

    const cities = validCities.slice(0, 2);
    const remainingCount = validCities.length - 2;

    return (
      <div className="flex items-center font-manrope text-xs text-[#5C5C5C]">
        <MapPin className="mr-1 size-3" strokeWidth={1.5} />
        <span>
          {cities.join(", ")}
          {remainingCount > 0 ? ` +${remainingCount} more` : ""}
        </span>
      </div>
    );
  };

  const getDescription = () => {
    if (!developer?.description || typeof developer.description !== "string") {
      return null;
    }

    const maxLength = 120;
    if (developer.description.length <= maxLength) {
      return developer.description;
    }

    return `${developer.description.substring(0, maxLength)}...`;
  };

  return (
    <Card className="property-surface">
      <CardContent className="p-5 sm:p-6">
        <p className="property-section-eyebrow">Developer</p>
        <h3 className="property-section-title mb-5">builder information</h3>

        <div className="mb-4 flex items-center gap-3">
          {developer.logoUrl && typeof developer.logoUrl === "string" ? (
            <img
              src={developer.logoUrl}
              alt={`${developer.name} logo`}
              className="size-11 rounded-[12px] border border-[#EBEBEB] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="property-icon-pill !size-11">
              <Building2 className="size-5" strokeWidth={1.5} />
            </div>
          )}
          <div>
            <h4 className="font-manrope text-sm font-semibold text-[#1A1A1A]">
              {developer.name}
            </h4>
            {getOperatingCitiesDisplay()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-3 rounded-[16px] border border-[#F0F0F0] bg-[#FAFAFA] p-3">
            <div className="property-icon-pill !size-8">
              <Award className="size-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="home-card-label">Experience</h4>
              <p className="mt-1 font-manrope text-sm font-medium text-[#1A1A1A]">
                {getYearsOfExperience()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-[16px] border border-[#F0F0F0] bg-[#FAFAFA] p-3">
            <div className="property-icon-pill !size-8">
              <Users className="size-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="home-card-label">Operating cities</h4>
              <p className="mt-1 font-manrope text-sm font-medium text-[#1A1A1A]">
                {getOperatingCitiesCount()}
              </p>
            </div>
          </div>
        </div>

        {getDescription() ? (
          <div className="mt-4 border-t border-[#F0F0F0] pt-4">
            <p className="font-manrope text-sm leading-relaxed text-[#5C5C5C]">
              {getDescription()}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
