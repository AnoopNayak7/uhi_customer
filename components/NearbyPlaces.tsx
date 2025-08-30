import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  School,
  Building,
  ShoppingBag,
  Train,
  Hospital,
  Loader2,
  MapPin,
  Plus,
  Clock,
  Car,
  X,
  Navigation,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import L from "leaflet";
import { useTravelPreferencesStore } from "@/lib/store";

interface Place {
  name: string;
  position: [number, number];
  distance: number;
  description?: string;
  address?: string;
  rating?: number;
}

interface TravelDestination {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  travelTime?: string;
  distance?: number;
  calculating?: boolean;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface LocationInfo {
  city: string;
  state: string;
  country: string;
  area: string;
  fullAddress: string;
}

interface NearbyPlacesProps {
  center: [number, number];
  locationName?: string;
  radius?: number;
  onLocationInfoUpdate?: (info: LocationInfo) => void;
}

interface FloorPlanZoomModalProps {
  imageUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const FloorPlanZoomModal = ({
  imageUrl,
  title,
  isOpen,
  onClose,
}: FloorPlanZoomModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.25, 5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.25, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetZoom();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-full bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={zoomOut}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                onClick={resetZoom}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={zoomIn}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                disabled={scale >= 5}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 relative overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                ref={imageRef}
                src={imageUrl}
                alt={title}
                className={`max-w-none transition-transform duration-200 ${
                  isDragging
                    ? "cursor-grabbing"
                    : scale > 1
                    ? "cursor-grab"
                    : "cursor-default"
                }`}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onLoad={() => {
                  if (imageRef.current) {
                    const img = imageRef.current;
                    const container = img.parentElement;
                    if (container) {
                      const containerAspect =
                        container.clientWidth / container.clientHeight;
                      const imageAspect = img.naturalWidth / img.naturalHeight;

                      if (imageAspect > containerAspect) {
                        img.style.width = "100%";
                        img.style.height = "auto";
                      } else {
                        img.style.width = "auto";
                        img.style.height = "100%";
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white border-t">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>Zoom: {Math.round(scale * 100)}%</span>
              <span>•</span>
              <span>Scroll to zoom • Drag to pan</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NearbyPlaces = ({
  center,
  locationName = "Selected Location",
  radius = 2,
  onLocationInfoUpdate,
}: NearbyPlacesProps) => {
  const [activeTab, setActiveTab] = useState("schools");
  const [places, setPlaces] = useState<{ [key: string]: Place[] }>({
    schools: [],
    hospitals: [],
    malls: [],
    metro: [],
  });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    schools: false,
    hospitals: false,
    malls: false,
    metro: false,
  });
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({
    schools: false,
    hospitals: false,
    malls: false,
    metro: false,
  });
  const [currentLocation, setCurrentLocation] = useState(center);
  const [locationDetails, setLocationDetails] = useState<LocationInfo | null>(
    null
  );
  const lastFetchedCoords = useRef<string | null>(null);
  const locationCache = useRef<Map<string, LocationInfo>>(new Map());
  const lastApiCallTime = useRef<number>(0);
  const isLoadingRef = useRef(false);
  const placesCache = useRef<Map<string, Place[]>>(new Map());
  const lastPlacesFetch = useRef<Map<string, number>>(new Map());

  // Create a stable reference for the callback
  const onLocationInfoUpdateRef = useRef(onLocationInfoUpdate);
  useEffect(() => {
    onLocationInfoUpdateRef.current = onLocationInfoUpdate;
  }, [onLocationInfoUpdate]);

  // Fetch location details from coordinates
  const fetchLocationDetails = useCallback(
    async (lat: number, lng: number) => {
      // Create a unique key for these coordinates
      const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;

      // Check cache first
      const cachedResult = locationCache.current.get(coordKey);
      if (cachedResult) {
        console.log(`Using cached result for coordinates: ${lat}, ${lng}`);
        setLocationDetails(cachedResult);
        if (onLocationInfoUpdateRef.current) {
          onLocationInfoUpdateRef.current(cachedResult);
        }
        return;
      }

      // Prevent duplicate API calls for the same coordinates
      if (lastFetchedCoords.current === coordKey || isLoadingRef.current) {
        console.log(
          `Skipping API call for coordinates: ${lat}, ${lng} (already fetched or loading)`
        );
        return;
      }

      // Rate limiting: ensure at least 1 second between API calls
      const now = Date.now();
      const timeSinceLastCall = now - lastApiCallTime.current;
      const minInterval = 1000; // 1 second minimum between calls

      if (timeSinceLastCall < minInterval) {
        console.log(
          `Rate limiting: waiting ${
            minInterval - timeSinceLastCall
          }ms before API call`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, minInterval - timeSinceLastCall)
        );
      }

      lastFetchedCoords.current = coordKey;
      lastApiCallTime.current = Date.now();
      isLoadingRef.current = true;

      console.log(`Fetching location details for coordinates: ${lat}, ${lng}`);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`
        );
        const data = await response.json();

        console.log("Location data received:", data);

        if (data && data.address) {
          const address = data.address;
          const locationInfo: LocationInfo = {
            city:
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county ||
              "Unknown City",
            state:
              address.state ||
              address.region ||
              address.province ||
              "Unknown State",
            country: address.country || "Unknown Country",
            area:
              address.suburb ||
              address.neighbourhood ||
              address.residential ||
              address.hamlet ||
              address.quarter ||
              address.district ||
              "Central Area",
            fullAddress: data.display_name || "Address not available",
          };

          console.log("Processed location info:", locationInfo);

          // Cache the result
          locationCache.current.set(coordKey, locationInfo);

          setLocationDetails(locationInfo);

          // Call parent callback if provided
          if (onLocationInfoUpdateRef.current) {
            onLocationInfoUpdateRef.current(locationInfo);
          }
        } else {
          console.warn("No address data found for coordinates");
          // Set fallback location info
          const fallbackInfo: LocationInfo = {
            city: "Unknown City",
            state: "Unknown State",
            country: "Unknown Country",
            area: "Unknown Area",
            fullAddress: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          };

          // Cache the fallback result
          locationCache.current.set(coordKey, fallbackInfo);

          setLocationDetails(fallbackInfo);
          if (onLocationInfoUpdateRef.current) {
            onLocationInfoUpdateRef.current(fallbackInfo);
          }
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
        // Set error fallback
        const errorInfo: LocationInfo = {
          city: "Location Error",
          state: "Unknown State",
          country: "Unknown Country",
          area: "Unknown Area",
          fullAddress: `Error fetching address for ${lat.toFixed(
            6
          )}, ${lng.toFixed(6)}`,
        };

        // Don't cache error results to allow retry
        setLocationDetails(errorInfo);
        if (onLocationInfoUpdateRef.current) {
          onLocationInfoUpdateRef.current(errorInfo);
        }
      } finally {
        isLoadingRef.current = false;
      }
    },
    [] // Remove onLocationInfoUpdate from dependencies
  );

  useEffect(() => {
    console.log("Center coordinates changed:", center);
    setCurrentLocation(center);
    fetchLocationDetails(center[0], center[1]);
  }, [center, fetchLocationDetails]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyPlaces = useCallback(
    async (category: string) => {
      // Use current location coordinates for fetching
      const [lat, lng] = currentLocation;
      const radiusMeters = radius * 1000;

      // Create cache key for this specific request
      const cacheKey = `${category}-${lat.toFixed(6)}-${lng.toFixed(
        6
      )}-${radius}`;

      // Check cache first
      const cachedPlaces = placesCache.current.get(cacheKey);
      const lastFetchTime = lastPlacesFetch.current.get(cacheKey) || 0;
      const minCacheTime = 5 * 60 * 1000; // 5 minutes cache

      if (cachedPlaces && Date.now() - lastFetchTime < minCacheTime) {
        console.log(
          `Using cached ${category} data for coordinates: ${lat}, ${lng}`
        );
        setPlaces((prev) => ({ ...prev, [category]: cachedPlaces }));
        return;
      }

      // Prevent duplicate API calls for the same category and location
      if (loading[category]) {
        console.log(`Skipping ${category} fetch - already loading`);
        return;
      }

      setLoading((prev) => ({ ...prev, [category]: true }));

      console.log(
        `Fetching ${category} near coordinates: ${lat}, ${lng} with radius: ${radiusMeters}m`
      );

      const queries = {
        schools: `
        [out:json][timeout:25];
        (
          node["amenity"="school"](around:${radiusMeters},${lat},${lng});
          way["amenity"="school"](around:${radiusMeters},${lat},${lng});
          node["amenity"="university"](around:${radiusMeters},${lat},${lng});
          way["amenity"="university"](around:${radiusMeters},${lat},${lng});
          node["amenity"="college"](around:${radiusMeters},${lat},${lng});
          way["amenity"="college"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
        hospitals: `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          node["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
          way["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
          node["healthcare"="clinic"](around:${radiusMeters},${lat},${lng});
          way["healthcare"="clinic"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
        malls: `
        [out:json][timeout:25];
        (
          node["shop"="mall"](around:${radiusMeters},${lat},${lng});
          way["shop"="mall"](around:${radiusMeters},${lat},${lng});
          node["building"="retail"](around:${radiusMeters},${lat},${lng});
          way["building"="retail"](around:${radiusMeters},${lat},${lng});
          node["amenity"="marketplace"](around:${radiusMeters},${lat},${lng});
          way["amenity"="marketplace"](around:${radiusMeters},${lat},${lng});
          node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
          way["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
          node["shop"="department_store"](around:${radiusMeters},${lat},${lng});
          way["shop"="department_store"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
        metro: `
        [out:json][timeout:25];
        (
          node["railway"="station"](around:${radiusMeters},${lat},${lng});
          node["public_transport"="station"](around:${radiusMeters},${lat},${lng});
          node["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
          node["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
          way["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
          node["public_transport"="stop_position"](around:${radiusMeters},${lat},${lng});
          node["highway"="bus_stop"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
      };

      try {
        const query = queries[category as keyof typeof queries];
        const response = await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: query,
          }
        );

        const data = await response.json();

        const processedPlaces: Place[] = data.elements
          .filter((element: any) => element.tags?.name)
          .map((element: any) => {
            const elementLat = element.lat || element.center?.lat;
            const elementLon = element.lon || element.center?.lon;

            if (!elementLat || !elementLon) return null;

            const distance = calculateDistance(
              lat,
              lng,
              elementLat,
              elementLon
            );

            return {
              name: element.tags.name,
              position: [elementLat, elementLon] as [number, number],
              distance: Math.round(distance * 100) / 100,
              address:
                element.tags["addr:full"] ||
                element.tags["addr:street"] ||
                element.tags["addr:city"] ||
                element.tags.address,
              description: getPlaceDescription(category, element.tags),
            };
          })
          .filter((place: Place | null) => place !== null)
          .sort((a: Place, b: Place) => a.distance - b.distance)
          .slice(0, 20); // Increased limit

        console.log(
          `Found ${processedPlaces.length} ${category} near the location`
        );

        // Cache the results
        placesCache.current.set(cacheKey, processedPlaces);
        lastPlacesFetch.current.set(cacheKey, Date.now());

        setPlaces((prev) => ({ ...prev, [category]: processedPlaces }));
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setPlaces((prev) => ({ ...prev, [category]: [] }));
      } finally {
        setLoading((prev) => ({ ...prev, [category]: false }));
      }
    },
    [currentLocation, radius, loading]
  );

  const getPlaceDescription = (category: string, tags: any): string => {
    switch (category) {
      case "schools":
        if (tags["amenity"] === "university") return "University";
        if (tags["amenity"] === "college") return "College";
        return "School";
      case "hospitals":
        if (tags["amenity"] === "clinic" || tags["healthcare"] === "clinic")
          return "Medical Clinic";
        if (tags["healthcare"] === "hospital") return "Healthcare Facility";
        return "Hospital";
      case "malls":
        if (tags["shop"] === "supermarket") return "Supermarket";
        if (tags["shop"] === "department_store") return "Department Store";
        if (tags["amenity"] === "marketplace") return "Marketplace";
        if (tags["building"] === "retail") return "Retail Building";
        return "Shopping Mall";
      case "metro":
        if (tags["amenity"] === "bus_station") return "Bus Station";
        if (tags["highway"] === "bus_stop") return "Bus Stop";
        if (tags["railway"] === "subway_entrance") return "Metro Entrance";
        if (tags["public_transport"] === "station") return "Public Transport";
        if (tags["public_transport"] === "stop_position") return "Transit Stop";
        return "Railway Station";
      default:
        return "";
    }
  };

  const markerColors = {
    schools: "#10b981", // green
    hospitals: "#ef4444", // red
    malls: "#3b82f6", // blue
    metro: "#8b5cf6", // violet
  };

  const categoryIcons = {
    schools: School,
    hospitals: Hospital,
    malls: ShoppingBag,
    metro: Train,
  };

  // Fetch places when location, category, or radius changes (with debouncing)
  useEffect(() => {
    // Debounce the fetch to prevent excessive API calls during rapid location changes
    const timeoutId = setTimeout(() => {
      fetchNearbyPlaces(activeTab);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [currentLocation, activeTab, radius, fetchNearbyPlaces]);

  const createCustomIcon = useCallback((color: string, iconType: string) => {
    const iconSvg = {
      schools: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><path d="M22 7s0-2-3-2-3 2-3 2v6c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V7z"/><path d="M2 7s0-2 3-2 3 2 3 2v6c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V7z"/><circle cx="11" cy="12" r="1"/></svg>`,
      hospitals: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/><circle cx="12" cy="12" r="10"/></svg>`,
      malls: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      metro: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M7 15h10"/><path d="M12 4v16"/><path d="M8 11h8"/></svg>`,
    };

    return new L.DivIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 3px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">${
        iconSvg[iconType as keyof typeof iconSvg]
      }</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      className: "custom-marker",
    });
  }, []);

  const createMainLocationIcon = useMemo(() => {
    return new L.DivIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#dc2626" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      className: "main-location-marker",
    });
  }, []);

  const refreshLocationData = () => {
    fetchLocationDetails(currentLocation[0], currentLocation[1]);
    fetchNearbyPlaces(activeTab);
  };

  return (
    <div className="space-y-4">
      {/* Location Details Card */}
      {locationDetails && (
        <Card className="p-2 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex justify-between items-start mb-2 md:mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600 hidden md:block" />
              <h3 className="font-medium md:font-semibold text-xs md:text-base text-gray-900">
                Location Details
              </h3>
            </div>
            <Button
              onClick={refreshLocationData}
              variant="ghost"
              size="sm"
              className="h-6 w-6 md:h-7 md:w-7 p-0"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
              <div>
                <span className="text-gray-600 text-xs">Area:</span>
                <div className="font-medium text-xs md:text-base">
                  {locationDetails.area}
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-xs">City:</span>
                <div className="font-medium text-xs md:text-base">
                  {locationDetails.city}
                </div>
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Full Address:</span>
              <div className="font-medium text-xs mt-1 break-words">
                {locationDetails.fullAddress}
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-white p-2 rounded border hidden md:block">
              <strong>Coordinates:</strong> {currentLocation[0].toFixed(6)},{" "}
              {currentLocation[1].toFixed(6)}
            </div>
          </div>
        </Card>
      )}

      {/* Map */}
      <div className="h-48 md:h-80 rounded-lg overflow-hidden border">
        <MapContainer
          center={currentLocation}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={currentLocation} icon={createMainLocationIcon}>
            <Popup>
              <div className="text-sm font-medium">{locationName}</div>
              <div className="text-xs text-gray-600">Property Location</div>
              <div className="text-xs text-gray-500 mt-1">
                {locationDetails?.area}, {locationDetails?.city}
              </div>
            </Popup>
          </Marker>

          <Circle
            center={currentLocation}
            radius={radius * 1000}
            pathOptions={{
              fillColor: "blue",
              fillOpacity: 0.1,
              color: "blue",
              weight: 1,
              dashArray: "5, 5",
            }}
          />

          {places[activeTab].map((place, index) => (
            <Marker
              key={`${activeTab}-${index}`}
              position={place.position}
              icon={createCustomIcon(
                markerColors[activeTab as keyof typeof markerColors],
                activeTab
              )}
            >
              <Popup>
                <div className="text-sm font-medium">{place.name}</div>
                <div className="text-xs text-gray-600">
                  {place.distance} km away
                </div>
                {place.description && (
                  <div className="text-xs mt-1">{place.description}</div>
                )}
                {place.address && (
                  <div className="text-xs text-gray-500">{place.address}</div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="schools"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4 h-auto p-1">
          <TabsTrigger
            value="schools"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 px-1 text-xs"
          >
            <School className="h-3 w-3 sm:h-3.5 sm:w-3.5 hidden sm:block" />
            <span className="text-xs sm:text-sm">Schools</span>
            {places.schools.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 h-4 sm:ml-1">
                {places.schools.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="hospitals"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 px-1 text-xs"
          >
            <Hospital className="h-3 w-3 sm:h-3.5 sm:w-3.5 hidden sm:block" />
            <span className="text-xs sm:text-sm">Hospitals</span>
            {places.hospitals.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 h-4 sm:ml-1">
                {places.hospitals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="malls"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 px-1 text-xs"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 hidden sm:block" />
            <span className="text-xs sm:text-sm">Malls</span>
            {places.malls.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 h-4 sm:ml-1">
                {places.malls.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="metro"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 px-1 text-xs"
          >
            <Train className="h-3 w-3 sm:h-3.5 sm:w-3.5 hidden sm:block" />
            <span className="text-xs sm:text-sm">Transport</span>
            {places.metro.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 h-4 sm:ml-1">
                {places.metro.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {Object.keys(places).map((category) => (
          <TabsContent key={category} value={category} className="mt-2 md:mt-3">
            {loading[category] ? (
              <div className="flex items-center justify-center py-6 md:py-8">
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin mr-2" />
                <span className="text-xs md:text-sm">
                  Loading nearby {category}...
                </span>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs md:text-sm text-gray-600">
                    Found {places[category].length} {category} within {radius}{" "}
                    km
                  </div>
                  <Button
                    onClick={() => fetchNearbyPlaces(category)}
                    variant="ghost"
                    size="sm"
                    className="h-6 md:h-7 text-xs px-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {places[category].length === 0 ? (
                    <div className="text-center py-4 md:py-8 text-gray-500 text-xs md:text-sm">
                      <div className="mb-2">
                        No {category} found within {radius} km radius
                      </div>
                      <div className="text-xs">
                        Try increasing the search radius
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                        {places[category]
                          .slice(
                            0,
                            expandedCategories[category]
                              ? places[category].length
                              : 3
                          )
                          .map((place, index) => {
                            const IconComponent =
                              categoryIcons[
                                category as keyof typeof categoryIcons
                              ];
                            return (
                              <Card
                                key={index}
                                className="p-2 md:p-3 border border-gray-200 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-2 md:gap-2.5">
                                  <div
                                    className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-content flex-shrink-0 hidden md:flex"
                                    style={{
                                      backgroundColor:
                                        markerColors[
                                          category as keyof typeof markerColors
                                        ],
                                    }}
                                  >
                                    <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-white mx-auto" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 text-xs md:text-sm">
                                      {place.name}
                                    </h3>
                                    <div className="flex items-center gap-1 md:gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1"
                                      >
                                        {place.distance} km
                                      </Badge>
                                      {place.description && (
                                        <span className="text-xs text-gray-500 hidden md:inline">
                                          {place.description}
                                        </span>
                                      )}
                                    </div>
                                    {place.address && (
                                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 hidden md:block">
                                        {place.address}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                      </div>

                      {places[category].length > 3 && (
                        <div className="flex justify-center">
                          <Button
                            onClick={() =>
                              setExpandedCategories((prev) => ({
                                ...prev,
                                [category]: !prev[category],
                              }))
                            }
                            variant="ghost"
                            size="sm"
                            className="text-xs flex items-center gap-1"
                          >
                            {expandedCategories[category] ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                See More ({places[category].length - 3} more)
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="text-xs text-gray-500 text-center hidden md:block">
        Search radius: {radius} km • Data from OpenStreetMap • Location:{" "}
        {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
      </div>
      <div className="text-xs text-gray-500 text-center md:hidden">
        Radius: {radius} km • {currentLocation[0].toFixed(2)},{" "}
        {currentLocation[1].toFixed(2)}
      </div>
    </div>
  );
};

interface EnhancedNearbyPlacesProps {
  propertyCoordinates?: [number, number];
  propertyAddress?: string;
}

const EnhancedNearbyPlaces = ({
  propertyCoordinates = [12.9716, 77.5946], // Fallback to Bangalore Central
  propertyAddress = "Property Location",
}: EnhancedNearbyPlacesProps) => {
  // Use property coordinates directly, not state with default fallback
  const [location, setLocation] =
    useState<[number, number]>(propertyCoordinates);
  const [locationName, setLocationName] = useState(propertyAddress);
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    city: "Loading...",
    state: "Loading...",
    country: "Loading...",
    area: "Loading...",
    fullAddress: "Fetching address details...",
  });
  const [radius, setRadius] = useState(2);
  const [newDestination, setNewDestination] = useState("");
  const [showTravelTime, setShowTravelTime] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [connectingRoads, setConnectingRoads] = useState<
    { name: string; distance: string }[]
  >([]);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isRecalculatingTravelTimes, setIsRecalculatingTravelTimes] =
    useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Use Zustand store for travel preferences
  const { preferredDestinations, addDestination, removeDestination } =
    useTravelPreferencesStore();

  // Function to get nearby roads
  const getNearbyRoads = useCallback(async (lat: number, lng: number) => {
    console.log(`Fetching nearby roads for: ${lat}, ${lng}`);
    try {
      const radiusMeters = 2000; // 2km radius for roads
      const query = `
        [out:json][timeout:25];
        (
          way["highway"~"^(primary|secondary|tertiary|trunk|motorway|residential)$"](around:${radiusMeters},${lat},${lng});
        );
        out geom;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query,
      });

      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        const roads = data.elements
          .filter((road: any) => road.tags?.name)
          .slice(0, 6)
          .map((road: any) => {
            // Calculate approximate distance to road
            const roadLat = road.geometry?.[0]?.lat || lat;
            const roadLng = road.geometry?.[0]?.lon || lng;
            const distance = calculateStraightLineDistance(
              lat,
              lng,
              roadLat,
              roadLng
            );

            return {
              name: road.tags.name,
              distance: `${Math.round(distance * 10) / 10} km`,
            };
          });

        console.log(`Found ${roads.length} nearby roads`);
        setConnectingRoads(roads);
      } else {
        console.log("No roads found, using fallback");
        setConnectingRoads([
          { name: "Main Road Access", distance: "0.5 km" },
          { name: "Local Road", distance: "0.2 km" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching roads:", error);
      setConnectingRoads([
        { name: "Main Road Access", distance: "0.5 km" },
        { name: "Local Road", distance: "0.2 km" },
      ]);
    }
  }, []);

  const calculateTravelTime = useCallback(
    async (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false&alternatives=false&steps=false`
        );
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const durationMinutes = Math.round(route.duration / 60);
          const distanceKm = Math.round((route.distance / 1000) * 10) / 10;

          const minTime = durationMinutes;
          const maxTime = Math.round(durationMinutes * 1.5);

          return {
            travelTime: `${minTime} - ${maxTime} mins`,
            distance: distanceKm,
          };
        }
      } catch (error) {
        console.error("Error calculating travel time:", error);
      }

      const distance = calculateStraightLineDistance(
        fromLat,
        fromLng,
        toLat,
        toLng
      );
      const estimatedTime = Math.round(distance * 3);
      return {
        travelTime: `${estimatedTime} - ${Math.round(
          estimatedTime * 1.3
        )} mins`,
        distance: Math.round(distance * 10) / 10,
      };
    },
    []
  );

  // Update location when property coordinates change
  useEffect(() => {
    console.log("Property coordinates changed:", propertyCoordinates);

    // Debounce the coordinate updates to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      setLocation(propertyCoordinates);
      setLocationName(propertyAddress);
      setIsLocationLoading(true);
      getNearbyRoads(propertyCoordinates[0], propertyCoordinates[1]);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [propertyCoordinates, propertyAddress, getNearbyRoads]);

  // Handle location info updates from NearbyPlaces component
  const handleLocationInfoUpdate = (info: LocationInfo) => {
    console.log("Received location info update:", info);
    setLocationInfo(info);

    // Auto-update location name based on the fetched location details
    const detectedLocationName = `${info.area}, ${info.city}`;
    if (propertyAddress === "Property Location") {
      setLocationName(detectedLocationName);
    }
    setIsLocationLoading(false);

    console.log(`Location updated to: ${detectedLocationName}`);
  };

  // Function to update location with coordinates
  const updateLocation = (lat: number, lng: number, name?: string) => {
    console.log(
      `Manually updating location to: ${lat}, ${lng}${name ? ` (${name})` : ""}`
    );
    setIsLocationLoading(true);
    setLocation([lat, lng]);
    if (name && name !== "Custom Location") {
      setLocationName(name);
    } else {
      setLocationName("Detecting Location...");
    }
    getNearbyRoads(lat, lng);
  };

  // Keep track of the last location for which we calculated travel times
  const lastCalculatedLocation = useRef<string>("");

  // Calculate travel times for existing destinations when location changes
  useEffect(() => {
    const recalculateTravelTimes = async () => {
      const currentLocationKey = `${location[0]},${location[1]}`;

      // Only recalculate if location actually changed and we have destinations
      if (
        preferredDestinations.length === 0 ||
        lastCalculatedLocation.current === currentLocationKey
      ) {
        return;
      }

      lastCalculatedLocation.current = currentLocationKey;
      setIsRecalculatingTravelTimes(true);
      console.log(
        `Recalculating travel times for ${preferredDestinations.length} destinations to new property location:`,
        location
      );

      // Process each destination individually to avoid batch update issues
      for (const dest of preferredDestinations) {
        console.log(
          `Calculating travel time from "${dest.name}" to property at: ${location[0]}, ${location[1]}`
        );

        try {
          const travelData = await calculateTravelTime(
            dest.position[0],
            dest.position[1],
            location[0],
            location[1]
          );

          // Create updated destination with new travel data
          const updatedDest = {
            ...dest,
            ...travelData,
            lastCalculated: Date.now(),
          };

          // Update this specific destination in the store
          removeDestination(dest.id);
          addDestination(updatedDest);

          console.log(
            `Updated travel time for "${dest.name}": ${travelData.travelTime}`
          );
        } catch (error) {
          console.error(
            `Failed to calculate travel time for "${dest.name}":`,
            error
          );
        }
      }

      console.log(
        "Finished updating all travel times for new property location"
      );
      setIsRecalculatingTravelTimes(false);
    };

    // Add a small delay to ensure location state has stabilized
    const timeoutId = setTimeout(recalculateTravelTimes, 500);

    return () => clearTimeout(timeoutId);
  }, [
    location,
    preferredDestinations,
    addDestination,
    removeDestination,
    calculateTravelTime,
  ]);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      // Include current location's country in search for better results
      const countryCode = locationInfo.country.toLowerCase().includes("india")
        ? "in"
        : "";
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5${
          countryCode ? `&countrycodes=${countryCode}` : ""
        }&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSearch = (query: string) => {
    setNewDestination(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const calculateStraightLineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const addTravelDestination = async (suggestion: LocationSuggestion) => {
    if (preferredDestinations.length >= 3) return;

    const newDest: TravelDestination = {
      id: Date.now().toString(),
      name: suggestion.display_name.split(",")[0],
      address: suggestion.display_name,
      position: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
    };

    // Add to Zustand store
    addDestination(newDest);
    setNewDestination("");
    setSuggestions([]);

    // Calculate travel time from the selected location TO the property (not from property to location)
    const travelData = await calculateTravelTime(
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon),
      location[0], // property coordinates
      location[1] // property coordinates
    );

    // Update destination with travel data in store
    const updatedDest = { ...newDest, ...travelData };
    removeDestination(newDest.id);
    addDestination(updatedDest);
  };

  const removeTravelDestination = (id: string) => {
    removeDestination(id);
  };

  // Function to manually set coordinates (useful for testing)
  const setCoordinatesManually = () => {
    const lat = prompt("Enter latitude:", location[0].toString());
    const lng = prompt("Enter longitude:", location[1].toString());

    if (lat && lng) {
      const newLat = parseFloat(lat);
      const newLng = parseFloat(lng);

      if (!isNaN(newLat) && !isNaN(newLng)) {
        setLocation([newLat, newLng]);
        setLocationName("Custom Location");
        setIsLocationLoading(true);
        getNearbyRoads(newLat, newLng);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-2 md:p-4 max-w-6xl mx-auto space-y-3 md:space-y-6">
      {/* Header */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <div className="p-3 md:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg hidden md:flex">
              {isLocationLoading ? (
                <Loader2 className="w-5 h-5 md:w-8 md:h-8 text-white animate-spin" />
              ) : (
                <Building className="w-5 h-5 md:w-8 md:h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-sm md:text-2xl font-bold text-white mb-1">
                {isLocationLoading ? "Detecting Location..." : locationName}
              </h1>
              <p className="text-blue-100 text-xs md:text-base">
                {isLocationLoading
                  ? "Fetching address details..."
                  : `${locationInfo.area}, ${locationInfo.city}`}
              </p>
              <p className="text-blue-200 text-xs md:text-sm">
                {isLocationLoading
                  ? "Please wait..."
                  : `${locationInfo.state}, ${locationInfo.country}`}
              </p>
            </div>
            <Button
              onClick={setCoordinatesManually}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-xs md:text-sm h-7 md:h-9 px-2 md:px-3"
            >
              <Navigation className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Change Location</span>
              <span className="md:hidden">Change</span>
            </Button>
          </div>
        </div>

        <div className="p-3 md:p-6 space-y-3 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Search Radius
              </label>
              <Select
                value={radius.toString()}
                onValueChange={(value) => setRadius(parseInt(value))}
              >
                <SelectTrigger className="h-8 md:h-10 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500/20 text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 km radius</SelectItem>
                  <SelectItem value="2">2 km radius</SelectItem>
                  <SelectItem value="3">3 km radius</SelectItem>
                  <SelectItem value="5">5 km radius</SelectItem>
                  <SelectItem value="10">10 km radius</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Coordinates
                  </p>
                  <p className="text-xs text-gray-600">
                    {location[0].toFixed(6)}, {location[1].toFixed(6)}
                  </p>
                </div>
              </div>
            </div> */}

            {/* {!isLocationLoading && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Status</p>
                    <p className="text-xs text-green-700">Location Detected</p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </Card>

      {/* Travel Time Section */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <div className="p-3 md:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100/50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hidden md:flex">
              <Clock className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">
                Travel Times
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                Calculate commute times to {locationName}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-6 space-y-3 md:space-y-6">
          {/* Search Input Section */}
          <div className="space-y-2 md:space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                type="text"
                value={newDestination}
                onChange={(e) => handleLocationSearch(e.target.value)}
                className="pl-10 pr-4 h-9 md:h-12 text-xs md:text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter starting point (home, office, school...)"
                disabled={preferredDestinations.length >= 3}
              />

              {/* Search Results Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      onClick={() => addTravelDestination(suggestion)}
                      className="w-full text-left p-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                      disabled={preferredDestinations.length >= 3}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {suggestion.display_name.split(",")[0]}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {suggestion.display_name}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {isSearching && newDestination.length >= 3 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span>Searching locations...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Route Visualization */}
            <div className="flex items-center justify-center gap-2 md:gap-4 py-3 md:py-4">
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                </div>
                <span className="text-xs text-gray-600 font-medium">From</span>
              </div>

              <div className="flex-1 relative">
                <div className="h-[2px] bg-gradient-to-r from-green-200 via-blue-200 to-purple-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white border-2 border-blue-300 rounded-full p-1">
                    <Car className="w-2 h-2 md:w-3 md:h-3 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Building className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  To Property
                </span>
              </div>
            </div>

            {/* Limit Message */}
            {preferredDestinations.length >= 3 && (
              <div className="text-center p-2 md:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs md:text-sm text-amber-700">
                  You&apos;ve reached the maximum of 3 saved locations
                </p>
              </div>
            )}
          </div>

          {/* Travel Times List */}
          {preferredDestinations.length > 0 && (
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">
                    Saved Locations ({preferredDestinations.length})
                  </h3>
                  {isRecalculatingTravelTimes && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-blue-600">
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      <span>Updating distances...</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowTravelTime(!showTravelTime)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                >
                  {showTravelTime ? "Hide" : "Show"} Details
                  <ChevronDown
                    className={`w-3 h-3 md:w-4 md:h-4 ml-1 transition-transform ${
                      showTravelTime ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {showTravelTime && (
                <div className="grid gap-2 md:gap-3">
                  {preferredDestinations.map((dest, index) => (
                    <div key={dest.id} className="group relative">
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                        <div className="flex items-start gap-3 md:gap-4">
                          {/* Location Icon */}
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                          </div>

                          {/* Location Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 md:gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1 truncate text-sm md:text-base">
                                  {dest.name}
                                </h4>
                                <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2 md:mb-3">
                                  {dest.address}
                                </p>

                                {/* Travel Info */}
                                <div className="flex items-center gap-2 md:gap-4">
                                  {dest.travelTime ? (
                                    <>
                                      <div className="flex items-center gap-1 md:gap-2">
                                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                                        <span className="font-medium text-gray-900 text-xs md:text-sm">
                                          {dest.travelTime}
                                        </span>
                                      </div>
                                      {dest.distance && (
                                        <div className="flex items-center gap-1 md:gap-2">
                                          <Navigation className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                                          <span className="text-xs md:text-sm text-gray-600">
                                            {dest.distance} km
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-1 md:gap-2">
                                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-blue-500" />
                                      <span className="text-xs md:text-sm text-gray-600">
                                        Calculating route...
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeTravelDestination(dest.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 md:p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Remove location"
                              >
                                <X className="w-3 h-3 md:w-4 md:h-4 text-red-400 hover:text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {preferredDestinations.length === 0 && (
            <div className="text-center py-6 md:py-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-2">
                No saved locations yet
              </h3>
              <p className="text-gray-600 text-xs md:text-sm max-w-sm mx-auto">
                Add your frequently visited places to see travel times and plan
                your commute
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Connecting Roads */}
      {connectingRoads.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
          <div className="p-3 md:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-green-100/50">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hidden md:flex">
                <Navigation className="w-3 h-3 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">
                  Road Connectivity
                </h2>
                <p className="text-xs md:text-sm text-gray-600">
                  Major roads and highways near this location
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {connectingRoads.map((road, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-gray-200 rounded-xl p-2 md:p-4 hover:shadow-md hover:border-green-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-4 h-4 md:w-8 md:h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 hidden md:flex">
                      <div className="w-1 h-1 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium md:font-semibold text-gray-900 truncate mb-1 text-xs md:text-base">
                        {road.name}
                      </h3>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-xs text-gray-500">Distance:</span>
                        <span className="text-xs md:text-sm font-medium text-green-600">
                          {road.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Nearby Places Component */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30">
        <div className="p-3 md:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100/50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hidden md:flex">
              <MapPin className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">
                Nearby Places
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                Discover schools, hospitals, malls, and transport options around
                your location
              </p>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-6">
          <NearbyPlaces
            center={location}
            locationName={locationName}
            radius={radius}
            onLocationInfoUpdate={handleLocationInfoUpdate}
          />
        </div>
      </Card>
    </div>
  );
};

export default EnhancedNearbyPlaces;
