"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/utils";

function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

function createPropertyMarker() {
  return L.divIcon({
    className: "properties-map-marker",
    html: `
      <div class="properties-map-marker__dot"></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function ScrollWheelControl() {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.disable();

    const enableScrollZoom = () => {
      map.scrollWheelZoom.enable();
    };

    map.on("focus", enableScrollZoom);
    map.on("click", enableScrollZoom);

    return () => {
      map.off("focus", enableScrollZoom);
      map.off("click", enableScrollZoom);
    };
  }, [map]);

  return null;
}

function AutoFitBounds({ properties }: { properties: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((property) => [property.latitude, property.longitude])
      );

      map.fitBounds(bounds, {
        padding: [24, 24],
        maxZoom: 15,
      });
    }
  }, [map, properties]);

  return null;
}

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const resize = () => {
      map.invalidateSize();
    };

    resize();
    const timer = window.setTimeout(resize, 150);
    window.addEventListener("resize", resize);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [map]);

  return null;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  properties?: any[];
  mapType?: "map" | "satellite";
}

export default function Map({
  center,
  zoom = 13,
  properties = [],
  mapType = "map",
}: MapProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const isSatellite = mapType === "satellite";
  const tileLayerUrl = isSatellite
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const tileAttribution = isSatellite
    ? "&copy; Esri"
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const propertiesWithCoordinates = properties.filter(
    (p) => p.latitude && p.longitude
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      scrollWheelZoom={false}
      className={isSatellite ? "properties-map-satellite" : "properties-map-light"}
    >
      <TileLayer
        attribution={tileAttribution}
        url={tileLayerUrl}
        subdomains={isSatellite ? undefined : "abcd"}
      />
      <ChangeView center={center} zoom={zoom} />
      <ScrollWheelControl />
      <MapResizeHandler />

      {propertiesWithCoordinates.length > 0 ? (
        <AutoFitBounds properties={propertiesWithCoordinates} />
      ) : null}

      {propertiesWithCoordinates.length > 0 ? (
        propertiesWithCoordinates.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createPropertyMarker()}
          >
            <Popup className="properties-map-popup">
              <div className="font-manrope text-sm">
                <p className="font-semibold text-[#1A1A1A]">{property.title}</p>
                <p className="text-[#484848]">{property.address}</p>
                <p className="mt-1 font-semibold text-[#1A1A1A]">
                  {formatPrice(property.price)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        <Marker position={center} icon={createPropertyMarker()}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
