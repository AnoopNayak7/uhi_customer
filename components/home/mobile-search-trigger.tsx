"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MobileSearch } from "./mobile-search";

export function MobileSearchTrigger() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      {/* Mobile Search Interface */}
      <div className="block sm:hidden bg-white border-b">
        <div className="px-4 py-4">
          {/* Search Bar */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
            <button
              onClick={() => setShowMobileSearch(true)}
              className="w-full h-12 pl-10 pr-12 text-left text-gray-500 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Search By City, Locality, Project
            </button>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <MobileSearch onClose={() => setShowMobileSearch(false)} />
      )}
    </>
  );
}
