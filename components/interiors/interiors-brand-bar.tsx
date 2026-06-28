"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InteriorsLogo } from "@/components/interiors/interiors-logo";

export function InteriorsBrandBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-[#EBEBEB] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <InteriorsLogo size="md" />

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#EBEBEB] px-3.5 py-2 font-montserrat text-xs font-medium text-[#484848] transition-colors hover:border-[#DDDDDD] hover:bg-[#FAFAFA] hover:text-[#222222]"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
