"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Create animated marker icon
const createAnimatedIcon = (isAnimated: boolean = false) => {
  return L.divIcon({
    className: `custom-marker ${isAnimated ? "animate-bounce" : ""}`,
    html: `
      <div class="relative">
        <div class="w-6 h-6 ${
          isAnimated ? "bg-blue-500 scale-110" : "bg-red-500"
        } rounded-full border-2 border-white shadow-lg ${
      isAnimated ? "animate-ping" : ""
    } transition-all duration-300"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 ${
          isAnimated ? "bg-blue-600" : "bg-red-600"
        } rounded-full transition-all duration-300"></div>
        ${
          isAnimated
            ? '<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-30"></div>'
            : ""
        }
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Create user location marker icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative">
        <div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-50"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Control component to prevent map from overlapping navbar and store map reference
const MapController = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
}) => {
  const map = useMap();

  useEffect(() => {
    // Store map reference
    mapRef.current = map;

    // Disable zoom on double click to prevent accidental zooming
    map.doubleClickZoom.disable();

    // Set max bounds to prevent excessive panning
    const bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
    map.setMaxBounds(bounds);

    return () => {
      map.doubleClickZoom.enable();
      mapRef.current = null;
    };
  }, [map, mapRef]);

  return null;
};

interface MarkerData {
  id: string;
  position: [number, number];
  popupText: string;
}

interface ComparisonMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  hoveredPropertyId?: string | null;
}

const ComparisonMap = ({
  center,
  zoom = 15,
  markers = [],
  hoveredPropertyId = null,
}: ComparisonMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcon();
  }, []);

  // Pan to hovered property location with debouncing
  useEffect(() => {
    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set new timeout for debouncing
    hoverTimeoutRef.current = setTimeout(() => {
      if (hoveredPropertyId && mapRef.current) {
        const hoveredMarker = markers.find(
          (marker) => marker.id === hoveredPropertyId
        );
        if (hoveredMarker) {
          // Smooth pan to the marker with a slight zoom adjustment
          mapRef.current.flyTo(hoveredMarker.position, Math.max(zoom, 14), {
            animate: true,
            duration: 1.0,
            easeLinearity: 0.1,
          });
        }
      } else if (!hoveredPropertyId && mapRef.current && markers.length > 0) {
        // When no property is hovered, return to the center view showing all markers
        const group = new L.FeatureGroup(
          markers.map((marker) => L.marker(marker.position))
        );
        mapRef.current.flyToBounds(group.getBounds(), {
          padding: [20, 20],
          animate: true,
          duration: 0.8,
        });
      }
    }, 200); // 200ms debounce delay

    // Cleanup timeout on unmount
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [hoveredPropertyId, markers, zoom]);

  // Custom marker component that can be animated
  const AnimatedMarker = ({ marker }: { marker: MarkerData }) => {
    const isHovered = hoveredPropertyId === marker.id;
    const isUserLocation = marker.id === "user-location";

    return (
      <Marker
        position={marker.position}
        icon={
          isUserLocation
            ? createUserLocationIcon()
            : createAnimatedIcon(isHovered)
        }
      >
        <Popup className="custom-popup">
          <div className="text-sm font-medium text-gray-900 p-2">
            {isUserLocation ? (
              <div className="font-semibold text-green-600">
                {marker.popupText}
              </div>
            ) : (
              <>
                <div className="font-semibold text-blue-600 mb-1">
                  {marker.popupText.split(" - ")[0]}
                </div>
                <div className="text-gray-600">
                  {marker.popupText.split(" - ")[1]}
                </div>
              </>
            )}
          </div>
        </Popup>
      </Marker>
    );
  };

  // Don't render map on server side to prevent hydration issues
  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", position: "relative" }}
        scrollWheelZoom={false}
        className="z-0 rounded-lg overflow-hidden"
        key={`map-${center[0]}-${center[1]}-${markers.length}`}
      >
        <MapController mapRef={mapRef} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render animated markers */}
        {markers.map((marker) => (
          <AnimatedMarker key={marker.id} marker={marker} />
        ))}
      </MapContainer>
    </>
  );
};

export default ComparisonMap;
