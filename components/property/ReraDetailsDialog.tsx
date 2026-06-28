"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

function getReraDetails(property: any) {
  const registrationNumber =
    property?.rera?.registrationNumber ||
    property?.reraNumber ||
    "Not received or not applied";

  const status = property?.reraStatus || property?.rera?.status || "Approved";

  const validUntil =
    property?.reraValidUntil ||
    property?.rera?.validUntil ||
    property?.rera?.validity ||
    "31 Dec 2025";

  return { registrationNumber, status, validUntil };
}

function ReraStatCard({
  label,
  value,
  large = false,
  className,
}: {
  label: string;
  value: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-[#EBEBEB] bg-[#FAFAFA] p-4 sm:p-5",
        className
      )}
    >
      <p className="property-stat-label">{label}</p>
      <p
        className={cn(
          "mt-2 font-manrope font-semibold leading-snug tracking-[-0.02em] text-[#1A1A1A]",
          large
            ? "break-all text-base sm:text-lg"
            : "text-lg sm:text-xl"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function ReraDetailsDialog({
  property,
  open,
  onOpenChange,
  trigger,
}: {
  property: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
}) {
  const { registrationNumber, status, validUntil } = getReraDetails(property);
  const isApproved = /approved|registered|active/i.test(status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-[24px] border border-[#EBEBEB] bg-white p-0 shadow-[0_24px_64px_rgba(15,23,42,0.12)] sm:max-w-lg">
        <div className="border-b border-[#F0F0F0] px-6 pb-5 pt-6">
          <div className="flex items-start gap-3 pr-8">
            <div className="property-icon-pill !h-10 !w-10 shrink-0">
              <Shield className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="property-section-eyebrow mb-1">Compliance</p>
              <h3 className="property-section-title !text-xl sm:!text-2xl">
                rera details
              </h3>
              <p className="mt-2 font-manrope text-sm leading-relaxed text-[#5C5C5C]">
                Verified registration under the Real Estate Regulatory
                Authority.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <ReraStatCard
            label="RERA registration number"
            value={registrationNumber}
            large
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReraStatCard label="Status" value={status} />
            <ReraStatCard label="Valid until" value={validUntil} />
          </div>

          {isApproved ? (
            <div className="flex items-center gap-2 rounded-full border border-[#EBEBEB] bg-[#FAFAFA] px-4 py-2.5">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-[#303030]"
                strokeWidth={1.5}
              />
              <span className="font-manrope text-sm font-medium text-[#3A3A3A]">
                Government approved project
              </span>
            </div>
          ) : null}

          <p className="font-manrope text-sm leading-relaxed text-[#5C5C5C]">
            RERA registration helps ensure the project meets regulatory
            requirements and provides buyer protection on approved sales.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
