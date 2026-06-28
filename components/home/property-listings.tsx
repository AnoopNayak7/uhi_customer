"use client";

import Link from "next/link";
import { ArrowRight, Building, Briefcase, Home, TreePine } from "lucide-react";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/home-section";

const propertyTypes = [
  {
    icon: Building,
    label: "All properties",
    title: "Properties in Bengaluru",
    description:
      "Apartments, houses, villas and more across the city.",
    link: "/properties?city=Bengaluru",
    features: ["Verified", "Best deals"],
  },
  {
    icon: Home,
    label: "Flats",
    title: "Flats in Bengaluru",
    description:
      "Modern apartments in top residential neighbourhoods.",
    link: "/properties?city=Bengaluru&category=apartment",
    features: ["Ready to move", "New launches"],
  },
  {
    icon: TreePine,
    label: "Plots",
    title: "Plots in Bengaluru",
    description:
      "Residential plots in fast-growing corridors.",
    link: "/properties?city=Bengaluru&category=plot",
    features: ["Clear title", "Investment ready"],
  },
  {
    icon: Briefcase,
    label: "Commercial",
    title: "Commercial properties",
    description:
      "Office spaces, retail shops and warehouses.",
    link: "/properties?city=Bengaluru&type=commercial",
    features: ["Prime locations", "High ROI"],
  },
];

export function PropertyListings() {
  return (
    <HomeSection className="bg-[#FAFAFA]">
      <HomeSectionHeader
        eyebrow="Explore by type"
        title="Property listings in Bengaluru"
        subtitle="Currently launching in Bengaluru with comprehensive property listings. More cities coming soon."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {propertyTypes.map((type) => {
          const Icon = type.icon;

          return (
            <Link
              key={type.title}
              href={type.link}
              className="group flex h-full flex-col rounded-[20px] border border-[#EBEBEB] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#DDDDDD] hover:shadow-[0_10px_36px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 py-1">
                <Icon className="size-2.5 text-[#484848]" strokeWidth={1} />
                <span className="font-manrope text-[10px] font-medium uppercase tracking-[0.1em] text-[#8A8A8A]">
                  {type.label}
                </span>
              </div>

              <h3 className="font-manrope text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#222222]">
                {type.title}
              </h3>

              <p className="mt-2 line-clamp-2 flex-grow font-manrope text-xs leading-relaxed text-[#717171]">
                {type.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {type.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-[#F5F5F5] px-2 py-0.5 font-manrope text-[10px] text-[#717171]"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-1 font-manrope text-[13px] font-medium text-[#222222] transition-colors group-hover:text-red-500">
                View properties
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
              </div>
            </Link>
          );
        })}
      </div>
    </HomeSection>
  );
}
