"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DashboardEmptyState,
  DashboardSection,
} from "@/components/dashboard/dashboard-ui";
import { SiteVisitBookingDialog } from "@/components/dashboard/site-visit-booking-dialog";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-[#F5F5F5] text-[#717171] border-[#E8E8E8]",
};

const transportLabels: Record<string, string> = {
  own_vehicle: "Own vehicle",
  pick_drop: "Pick-up & drop",
};

function formatVisitDate(date?: string) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DashboardSiteVisitsSection({
  visits,
  onRefresh,
}: {
  visits: any[];
  onRefresh?: () => void;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [setupVisit, setSetupVisit] = useState<any | null>(null);

  const openSetup = (visit: any) => {
    setSetupVisit(visit);
    setBookingOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setBookingOpen(open);
    if (!open) setSetupVisit(null);
  };

  return (
    <>
      <DashboardSection
        title="Site visits"
        subtitle="Properties you've booked to visit"
        action={
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-[#D0D0D0] font-manrope text-xs"
            onClick={() => {
              setSetupVisit(null);
              setBookingOpen(true);
            }}
          >
            Book a site visit
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        }
      >
        {visits.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {visits.map((visit) => {
              const property = visit.property;
              const title =
                property?.title || visit.propertyTitle || "Property visit";
              const address =
                property?.address ||
                visit.propertyAddress ||
                property?.city ||
                "Bengaluru";
              const image = property?.images?.[0];
              const status = visit.status || "pending";
              const visitDate = formatVisitDate(
                visit.preferredDate || visit.scheduledDate || visit.visitDate
              );
              const needsSetup =
                !visit.transportMode &&
                status !== "completed" &&
                status !== "cancelled";

              return (
                <div
                  key={visit.id}
                  className="flex gap-3 rounded-[16px] border border-[#E8E8E8] bg-[#FAFAFA] p-3 sm:p-4"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#EBEBEB] sm:size-24">
                    {image ? (
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized={image.startsWith("https://via.placeholder")}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <CalendarDays
                          className="size-6 text-[#B0B0B0]"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="line-clamp-2 font-manrope text-sm font-semibold text-[#1A1A1A]">
                        {title}
                      </h3>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.06em]",
                          statusStyles[status] || statusStyles.pending
                        )}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-1 font-manrope text-xs text-[#717171]">
                      <MapPin className="size-3 shrink-0" strokeWidth={1.5} />
                      <span className="line-clamp-1">{address}</span>
                    </p>

                    {visitDate ? (
                      <p className="mt-2 flex items-center gap-1 font-manrope text-xs font-medium text-[#484848]">
                        <CalendarDays
                          className="size-3 shrink-0"
                          strokeWidth={1.5}
                        />
                        {visitDate}
                        {visit.preferredTime ? ` · ${visit.preferredTime}` : ""}
                      </p>
                    ) : (
                      <p className="mt-2 flex items-center gap-1 font-manrope text-xs text-[#717171]">
                        <Clock className="size-3 shrink-0" strokeWidth={1.5} />
                        Scheduling in progress
                      </p>
                    )}

                    {visit.transportMode ? (
                      <p className="mt-2 flex items-center gap-1 font-manrope text-xs text-[#484848]">
                        <Car className="size-3 shrink-0" strokeWidth={1.5} />
                        {transportLabels[visit.transportMode] || visit.transportMode}
                        {visit.pickupLocation
                          ? ` · ${visit.pickupLocation}`
                          : ""}
                      </p>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {property?.id ? (
                        <Link
                          href={`/properties/${property.slug || property.id}`}
                          className="inline-flex items-center font-manrope text-xs font-medium text-[#303030] hover:underline"
                        >
                          View property
                          <ArrowRight
                            className="ml-1 size-3"
                            strokeWidth={1.5}
                          />
                        </Link>
                      ) : null}

                      {needsSetup || visit.transportMode ? (
                        <button
                          type="button"
                          onClick={() => openSetup(visit)}
                          className="inline-flex items-center font-manrope text-xs font-medium text-[#303030] hover:underline"
                        >
                          <Settings2
                            className="mr-1 size-3"
                            strokeWidth={1.5}
                          />
                          {needsSetup ? "Set up visit" : "Edit transport"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <DashboardEmptyState
            icon={Car}
            title="No site visits yet"
            description="Book a free pick-up and drop tour across Bengaluru — we'll plan your route and take you to the right projects."
            actionLabel="Book a site visit"
            onAction={() => {
              setSetupVisit(null);
              setBookingOpen(true);
            }}
          />
        )}
      </DashboardSection>

      <SiteVisitBookingDialog
        open={bookingOpen}
        onOpenChange={handleDialogChange}
        visit={
          setupVisit
            ? {
                id: setupVisit.id,
                propertyTitle:
                  setupVisit.property?.title || setupVisit.propertyTitle,
                transportMode: setupVisit.transportMode,
                pickupLocation: setupVisit.pickupLocation,
                dropoffLocation: setupVisit.dropoffLocation,
                locationMarkToken: setupVisit.locationMarkToken,
              }
            : null
        }
        onSaved={onRefresh}
      />
    </>
  );
}
