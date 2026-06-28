"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { MobileSearch } from "./mobile-search";

export function MobileSearchTrigger() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      <div className="border-b border-[#EBEBEB] bg-white sm:hidden">
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => setShowMobileSearch(true)}
            className="flex w-full items-center gap-3 rounded-full border border-[#DDDDDD] bg-white px-4 py-2.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all active:scale-[0.99] active:border-[#B0B0B0]"
          >
            <Search className="size-4 shrink-0 text-[#222222]" strokeWidth={1.5} />
            <span className="min-w-0 flex-1 truncate font-manrope text-sm text-[#717171]">
              Search city, locality or project
            </span>
          </button>
        </div>
      </div>

      {showMobileSearch ? (
        <MobileSearch onClose={() => setShowMobileSearch(false)} />
      ) : null}
    </>
  );
}
