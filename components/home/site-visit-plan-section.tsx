"use client";

import { useState } from "react";
import { ArrowRight, Car, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeSection } from "@/components/home/home-section";
import { BookSiteVisitDialog } from "@/components/home/book-site-visit-dialog";
import { cn } from "@/lib/utils";

const highlights = [
  {
    value: "300+",
    label: "Site visits completed",
    icon: MapPin,
  },
  {
    label: "5 star ratings",
    icon: Star,
    showStars: true,
  },
  {
    label: "Complimentary pick-up & drop anywhere in Bengaluru",
    icon: Car,
    wide: true,
  },
] as const;

const steps = [
  {
    number: "1",
    title: "Book your visit",
    description: "Share your budget, areas, and shortlisted projects in Bengaluru.",
  },
  {
    number: "2",
    title: "We pick you up",
    description: "We collect you from home, office, or a metro stop — on time.",
  },
  {
    number: "3",
    title: "Tour & compare",
    description: "Visit 3–4 RERA-verified projects in one planned route with an advisor.",
  },
  {
    number: "4",
    title: "Drop back home",
    description: "Once you're done, we drop you back. No cab bookings, no hassle.",
  },
];

const pointers = [
  "Dedicated property advisor on every trip",
  "Weekday, evening, and weekend slots available",
];

export function SiteVisitPlanSection() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <HomeSection>
        <div className="mx-auto max-w-4xl">
          <p className="home-section-eyebrow">Bengaluru · Pick &amp; drop</p>

          <h2 className="home-section-headline max-w-lg !text-[2rem] sm:!text-[2.35rem]">
            site visits, planned for you
          </h2>

          <p className="mt-4 max-w-xl font-manrope text-sm leading-relaxed text-[#717171] md:text-[15px]">
            Skip the traffic and scattered appointments. We plan your route,
            pick you up, and take you to the right projects — all in one
            comfortable trip.
          </p>

          <div className="property-surface mt-8 overflow-hidden">
            <div className="grid grid-cols-1 bg-[#EBEBEB] gap-px sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-3 bg-white px-4 py-4 sm:flex-col sm:justify-center sm:gap-2.5 sm:px-5 sm:py-6 sm:text-center",
                      "wide" in item && item.wide && "sm:col-span-1"
                    )}
                  >
                    <span className="property-icon-pill size-9 shrink-0 sm:size-9">
                      <Icon className="size-4" strokeWidth={1.5} />
                    </span>

                    <div className="min-w-0 flex-1 sm:flex sm:flex-col sm:items-center sm:gap-1.5">
                      {"showStars" in item && item.showStars ? (
                        <>
                          <div
                            className="hidden items-center justify-center gap-0.5 sm:flex"
                            aria-label="5 star ratings"
                          >
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                className="size-3.5 fill-[#303030] text-[#303030]"
                                strokeWidth={0}
                              />
                            ))}
                          </div>
                          <div className="font-playfair text-lg font-bold leading-none text-[#1A1A1A] sm:hidden">
                            5★
                          </div>
                        </>
                      ) : "value" in item ? (
                        <div className="font-playfair text-xl font-bold leading-none tracking-[-0.02em] text-[#1A1A1A] sm:text-2xl">
                          {item.value}
                        </div>
                      ) : null}

                      <p className="font-manrope text-xs leading-snug text-[#717171] sm:text-[11px]">
                        {item.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#303030] font-manrope text-xs font-semibold text-white">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-manrope text-sm font-semibold text-[#222222]">
                    {step.title}
                  </h3>
                  <p className="mt-1 font-manrope text-sm leading-relaxed text-[#717171]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ul className="mt-8 space-y-2 border-t border-[#EBEBEB] pt-8">
            {pointers.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 font-manrope text-sm text-[#484848]"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#303030]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="property-btn-pill h-11 w-full bg-[#303030] px-6 text-white hover:bg-[#1a1a1a] sm:w-auto"
            >
              Book a site visit
              <ArrowRight className="ml-2 size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </HomeSection>

      <BookSiteVisitDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
