"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAuthStore, useSearchStore } from "@/lib/store";
import {
  trackPropertySearch,
} from "@/components/analytics/GoogleAnalytics";
import { Search, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PropertyList } from "@/components/propertyListing/PropertyList";
import { MapView } from "@/components/propertyListing/MapView";
import { MobileFilterDrawer } from "@/components/propertyListing/MobileFilterDrawer";
import { ViewModeToggle } from "@/components/propertyListing/properties-view-controls";
import { HorizontalFilterBar } from "@/components/propertyListing/HorizontalFilterBar";

import { PageContent } from "@/components/animations/layout-wrapper";
import { PropertyGridSkeleton } from "@/components/ui/PropertyCardSkeleton";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/propertyListing/FilterSection";

export function PropertiesPageClient() {
  const searchParams: any = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { searchFilters, updateSearchFilters } = useSearchStore();

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [showLocalitySearch, setShowLocalitySearch] = useState(false);
  const [localitySearchQuery, setLocalitySearchQuery] = useState("");
  const [localitySuggestions, setLocalitySuggestions] = useState<any[]>([]);
  const [isSearchingLocalities, setIsSearchingLocalities] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const mobileLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const stickyToolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const updateToolbarHeight = () => {
      const toolbar = stickyToolbarRef.current;
      if (!toolbar) return;

      const bottom = toolbar.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty(
        "--properties-toolbar-height",
        `${Math.max(bottom, 0)}px`
      );
    };

    updateToolbarHeight();

    const observer = new ResizeObserver(updateToolbarHeight);
    if (stickyToolbarRef.current) {
      observer.observe(stickyToolbarRef.current);
    }

    window.addEventListener("resize", updateToolbarHeight);
    window.addEventListener("scroll", updateToolbarHeight, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateToolbarHeight);
      window.removeEventListener("scroll", updateToolbarHeight);
      document.documentElement.style.removeProperty(
        "--properties-toolbar-height"
      );
    };
  }, [viewMode]);

  useEffect(() => {
    const isDesktopMap = viewMode === "map" && window.innerWidth >= 1024;

    if (isDesktopMap) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const onResize = () => {
      const desktopMap = viewMode === "map" && window.innerWidth >= 1024;
      document.body.style.overflow = desktopMap ? "hidden" : "";
    };

    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", onResize);
    };
  }, [viewMode]);

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchProperties = useCallback(
    async (page = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params: any = {};

        // Convert URL search params to API params
        for (const [key, value] of searchParams.entries()) {
          if (value) {
            params[key] = value;
          }
        }

        params.limit = 9; // Load 9 properties at a time
        params.page = page;

        const response: any = await apiClient.getProperties(params);

        if (response.success && response.data) {
          console.log("Properties API response:", response);
          console.log("Properties data:", response.data);
          console.log("First property sample:", response.data[0]);

          // Ensure all properties have images
          const propertiesWithImages = response.data.map((property: any) => {
            if (!property.images || property.images.length === 0) {
              // Add default images if none exist - using more reliable URLs
              property.images = [
                "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Property+Image",
                "https://via.placeholder.com/800x600/10B981/FFFFFF?text=Property+Image",
                "https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Property+Image",
              ];
              console.log(
                `Added default images to property ${property.id}:`,
                property.images
              );
            } else {
              console.log(
                `Property ${property.id} already has images:`,
                property.images
              );
            }
            return property;
          });

          if (append) {
            setProperties((prev) => [...prev, ...propertiesWithImages]);
          } else {
            setProperties(propertiesWithImages);
          }

          // Check if there are more pages and set total count
          const pagination = response.pagination || response.meta;
          const totalPages = pagination?.totalPages || 1;
          const total = pagination?.totalItems || response.data.length;
          const hasMoreData = pagination?.hasNext || page < totalPages;
          
          console.log("Pagination debug:", {
            currentPage: page,
            totalPages,
            total,
            hasMoreData,
            dataLength: response.data.length,
            pagination: pagination
          });
          
          setHasMore(hasMoreData);
          setCurrentPage(page);
          setTotalCount(total);
        } else {
          throw new Error("Failed to fetch properties");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        if (!append) {
          setProperties([]);
        }
        toast.error("Failed to load properties");
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [searchParams]
  );

  const buildFilterParams = useCallback(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        params[key] = value;
      }
    }
    return params;
  }, [searchParams]);

  const fetchMapMarkers = useCallback(async () => {
    try {
      const response: any = await apiClient.getPropertyMapMarkers(
        buildFilterParams()
      );

      if (response.success && Array.isArray(response.data)) {
        setMapMarkers(response.data);
      } else {
        setMapMarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map markers:", error);
      setMapMarkers([]);
    }
  }, [buildFilterParams]);

  useEffect(() => {
    // Update search filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      updateSearchFilters(params);
    }
    // Reset pagination when search params change
    setCurrentPage(1);
    setHasMore(true);
    setTotalCount(0);
    setMapMarkers([]);
    fetchProperties(1, false);
    fetchMapMarkers();
  }, [searchParams, updateSearchFilters, fetchProperties, fetchMapMarkers]);

  // Handle load more for manual triggers (like MapView button)
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      fetchProperties(currentPage + 1, true);
    }
  }, [hasMore, loadingMore, loading, currentPage, fetchProperties]);

  // Infinite scroll effect
  useEffect(() => {
    const loadMore = () => {
      if (hasMore && !loadingMore && !loading) {
        fetchProperties(currentPage + 1, true);
      }
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    // Observe both mobile and desktop load more triggers
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    if (mobileLoadMoreRef.current) {
      observerRef.current.observe(mobileLoadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, currentPage, fetchProperties]);

  const handleFilterChange = (key: string, value: string) => {
    // Handle special "all" values by converting them to empty strings
    const actualValue =
      value === "all-cities" ||
      value === "all-types" ||
      value === "all-categories"
        ? ""
        : value;
    updateSearchFilters({ [key]: actualValue });

    const params = new URLSearchParams(searchParams.toString());
    if (actualValue) {
      params.set(key, actualValue);
    } else {
      params.delete(key);
    }

    // Navigate to new URL with updated params
    router.push(`/properties?${params.toString()}`);
  };

  // Search localities function
  const searchLocalities = async (query: string) => {
    if (!query.trim()) {
      setLocalitySuggestions([]);
      return;
    }

    setIsSearchingLocalities(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in&limit=10`
      );
      const data = await response.json();
      setLocalitySuggestions(data);
    } catch (error) {
      console.error("Error searching localities:", error);
    } finally {
      setIsSearchingLocalities(false);
    }
  };

  const handleLocalitySearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchLocalities(localitySearchQuery);
    }
  };

  const handleLocalitySelect = (suggestion: any) => {
    const localityName = suggestion.display_name.split(",")[0].trim();
    if (!selectedLocalities.includes(localityName)) {
      setSelectedLocalities((prev) => [...prev, localityName]);
    }
    setLocalitySearchQuery("");
    setLocalitySuggestions([]);
    setShowLocalitySearch(false);
  };

  const removeLocality = (locality: string) => {
    setSelectedLocalities((prev) => prev.filter((l) => l !== locality));
  };

  const applySearchToUrl = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = query.trim();

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    applySearchToUrl(searchQuery);
    trackPropertySearch(searchQuery || "property_search", searchFilters);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      applySearchToUrl(query);
    }, 500);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsGettingLocation(false);
        toast.success("Location found");

        // If in map view, center the map on user location
        if (viewMode === "map") {
          // The map component will automatically center on the new userLocation
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location");
        setIsGettingLocation(false);
      }
    );
  };

  const handleFavorite = async (property: any) => {
    if (!user) {
      toast.error("Please login to add favourites");
      return;
    }

    try {
      const isFavorite = property.isFavourite;
      if (isFavorite) {
        await apiClient.removeFromFavourites(property.id);
        toast.success("Property removed from favourites");
      } else {
        await apiClient.addToFavourites(property.id);
        toast.success("Property added to favourites");
      }
      // Update the property's favourite status
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, isFavourite: !isFavorite } : p
        )
      );
    } catch (error) {
      console.error("Error updating favourite:", error);
      toast.error("Failed to update favourite");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header hideOnScroll />

      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          viewMode === "map" ? "pt-4" : "pt-6 lg:pt-8"
        )}
      >
        <PageContent>
          <div
            className={cn(
              "relative mb-4 overflow-hidden rounded-[24px] border border-[#EBEBEB] bg-white px-5 py-6 sm:mb-6 sm:px-8 sm:py-8",
              viewMode === "map" && "hidden"
            )}
          >
            <div
              aria-hidden
              className="hero-cred-background pointer-events-none absolute inset-0 z-[1]"
            />
            <div className="relative z-10">
              <p className="home-section-eyebrow mb-0">Browse</p>
              <h1 className="home-section-headline mt-2 !text-[1.75rem] sm:!text-[2.5rem]">
                {searchParams.get("search")
                  ? `results for “${searchParams.get("search")}”`
                  : searchParams.get("city")
                    ? `properties in ${searchParams.get("city")?.toLowerCase()}`
                    : "properties for you"}
              </h1>
              <p className="mt-3 font-manrope text-sm text-[#5C5C5C]">
                {loading
                  ? "Searching..."
                  : `${totalCount} properties found`}
              </p>
            </div>
          </div>
        </PageContent>
      </div>

      {/* Full-width sticky toolbar — sibling of hero/main so nothing clips the bleed */}
      <div
        ref={stickyToolbarRef}
        className="properties-sticky-toolbar sticky top-[var(--header-offset,4rem)] z-30 border-b border-[#F0F0F0] bg-white py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-[top] duration-300 ease-in-out"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile Search */}
            <div className="lg:hidden">
              <div className="relative">
                <div className="flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <Search className="size-4 shrink-0 text-[#5C5C5C]" strokeWidth={1.5} />
                  <Input
                    type="text"
                    placeholder="Search builder, project, city or locality"
                    className="h-10 flex-1 border-0 bg-transparent px-0 font-manrope text-sm text-[#222222] shadow-none placeholder:text-[#949494] focus-visible:ring-0"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                    style={{ fontSize: "16px" }}
                  />
                  <Button
                    onClick={handleSearch}
                    className="property-btn-pill h-9 shrink-0 rounded-full bg-[#303030] px-4 text-white hover:bg-[#1a1a1a]"
                  >
                    <Search className="size-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden w-full lg:block">
              <div className="flex w-full items-center gap-3">
                <div className="relative flex-1">
                  <div className="flex items-center gap-3 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <Search className="size-4 shrink-0 text-[#5C5C5C]" strokeWidth={1.5} />
                    <Input
                      type="text"
                      placeholder="Search builder, project, city or locality"
                      className="h-10 flex-1 border-0 bg-transparent px-0 font-manrope text-sm text-[#222222] shadow-none placeholder:text-[#949494] focus-visible:ring-0"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleSearchKeyDown}
                    />

                  </div>
                </div>

                <Button
                  variant="outline"
                  className="h-11 rounded-full border-[#DDDDDD] font-manrope text-sm text-[#3A3A3A] hover:bg-[#FAFAFA]"
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Navigation className="size-4" strokeWidth={1.5} />
                  )}
                  <span className="ml-2">Near me</span>
                </Button>

                <Button
                  onClick={handleSearch}
                  className="property-btn-pill h-11 rounded-full bg-[#303030] px-6 text-white hover:bg-[#1a1a1a]"
                >
                  Search
                </Button>
              </div>

              <HorizontalFilterBar
                onSearch={handleSearch}
                handleFilterChange={handleFilterChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>

            {/* Mobile filters row */}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#F0F0F0] pt-3 lg:hidden">
              <p className="min-w-0 truncate font-manrope text-sm text-[#5C5C5C]">
                {loading ? "Searching..." : `${totalCount} results`}
              </p>
              <MobileFilterDrawer
                onSearch={handleSearch}
                handleFilterChange={handleFilterChange}
              />
            </div>
        </div>
      </div>

      <main
        className={cn(
          "mx-auto w-full flex-1",
          viewMode === "map"
            ? "max-w-none px-0 pb-4 lg:px-4"
            : "max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-12"
        )}
      >
          <div className={cn("overflow-x-hidden", viewMode === "map" && "lg:overflow-hidden")}>
            {viewMode !== "map" ? (
              <FilterSection
                onSearch={handleSearch}
                handleFilterChange={handleFilterChange}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                propertiesCount={properties.length}
              />
            ) : null}

            <div className="min-w-0 w-full">
              {/* Mobile view */}
              <div className="block lg:hidden">
                {viewMode === "grid" ? (
                  <>
                    {loading ? (
                      <PropertyGridSkeleton count={9} />
                    ) : (
                      <PropertyList
                        properties={properties}
                        loading={loading}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        onFavorite={handleFavorite}
                      />
                    )}

                    <div
                      ref={mobileLoadMoreRef}
                      className="mt-4 flex h-10 items-center justify-center"
                    >
                      {loadingMore ? (
                        <div className="flex items-center space-x-2">
                          <div className="size-5 animate-spin rounded-full border-2 border-[#EBEBEB] border-t-[#303030]" />
                          <span className="font-manrope text-sm text-[#5C5C5C]">
                            Loading more properties...
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {loadingMore ? (
                      <div className="mt-4">
                        <PropertyGridSkeleton count={3} />
                      </div>
                    ) : null}

                    <div className="h-20" aria-hidden />
                  </>
                ) : (
                  <MapView
                    mobile
                    properties={properties}
                    mapMarkers={mapMarkers}
                    userLocation={userLocation}
                    mapType={mapType}
                    setMapType={setMapType}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    onLoadMore={handleLoadMore}
                    totalCount={totalCount}
                  />
                )}
              </div>

              <div className="hidden lg:block">
                {viewMode === "grid" ? (
                  <div>
                    {loading ? (
                      <PropertyGridSkeleton count={9} />
                    ) : (
                      <PropertyList
                        properties={properties}
                        loading={loading}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        onFavorite={handleFavorite}
                      />
                    )}
                    <div
                      ref={loadMoreRef}
                      className="flex h-10 items-center justify-center"
                    >
                      {loadingMore ? (
                        <div className="flex items-center space-x-2">
                          <div className="size-5 animate-spin rounded-full border-2 border-[#EBEBEB] border-t-[#303030]" />
                          <span className="font-manrope text-sm text-[#5C5C5C]">
                            Loading more properties...
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {loadingMore ? (
                      <div className="mt-4">
                        <PropertyGridSkeleton count={3} />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <MapView
                    properties={properties}
                    mapMarkers={mapMarkers}
                    userLocation={userLocation}
                    mapType={mapType}
                    setMapType={setMapType}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    onLoadMore={handleLoadMore}
                    totalCount={totalCount}
                  />
                )}
              </div>
            </div>
          </div>
      </main>

      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden">
        <ViewModeToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          className="shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        />
      </div>
    </div>
  );
}
