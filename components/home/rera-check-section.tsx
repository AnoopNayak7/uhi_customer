"use client";

import { ArrowRight, FileSearch, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeSection } from "@/components/home/home-section";

export function ReraCheckSection() {
  return (
    <HomeSection>
      <div className="property-surface overflow-hidden p-6 md:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-[#FAFAFA] px-3 py-1 font-manrope text-[11px] font-semibold uppercase tracking-[0.12em] text-[#717171]">
              <ShieldCheck className="size-3.5" />
              RERA verification
            </div>
            <h2 className="property-section-title max-w-xl">
              Check litigations &amp; property details by RERA ID
            </h2>
            <p className="mt-3 max-w-xl font-manrope text-sm leading-relaxed text-[#717171] md:text-base">
              Check RERA registration, project documents, reviews, and
              litigation records in one report.
            </p>
            <ul className="mt-6 space-y-2 font-manrope text-sm text-[#484848]">
              <li className="flex items-center gap-2">
                <FileSearch className="size-4 text-[#717171]" />
                Official RERA project &amp; possession details
              </li>
              <li className="flex items-center gap-2">
                <Scale className="size-4 text-[#717171]" />
                Court records &amp; litigation scan
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="font-manrope text-sm text-[#717171] lg:text-right">
              Example: PRM/KA/RERA/1251/308/PR/171220/005988
            </p>
            <Button
              asChild
              className="property-btn-pill bg-[#303030] px-6 text-white hover:bg-[#1a1a1a]"
            >
              <Link href="/tools/rera-check">
                Check by RERA ID
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
