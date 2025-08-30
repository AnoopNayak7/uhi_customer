"use client";

import { useState } from "react";
import { Search, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MobileSearch } from "./mobile-search";

export function MobileSearchTrigger() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      {/* Mobile Search Interface */}
      <div className="block sm:hidden bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-5">
          {/* Enhanced Search Bar */}
          <div className="relative group">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Main Search Container */}
            <div className="relative bg-white border-2 border-gray-100 hover:border-red-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Location Icon */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Search Button */}
              <button
                onClick={() => setShowMobileSearch(true)}
                className="w-full h-14 pl-16 pr-20 text-left text-gray-600 bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 mb-1">Search for properties</span>
                  <span className="text-base font-medium text-gray-700">City, Locality, Project</span>
                </div>
              </button>
              
              {/* Search Icon Button */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            {/* Subtle Bottom Border */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Quick Search Suggestions */}
          {/* <div className="mt-4 flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Popular: </span>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs px-2 py-1 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 transition-colors duration-200 cursor-pointer">
                Bangalore
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 transition-colors duration-200 cursor-pointer">
                Mumbai
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 transition-colors duration-200 cursor-pointer">
                Delhi
              </Badge>
            </div>
          </div> */}
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <MobileSearch onClose={() => setShowMobileSearch(false)} />
      )}
    </>
  );
}
