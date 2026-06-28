"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Hand, Pencil } from "lucide-react";
import type {
  GeoPoint,
  LocationAreaMode,
  MapInteractionTool,
} from "@/lib/location-mark/types";
import { simplifyPolygonPath } from "@/lib/location-mark/geo-utils";
import { createPickupMarkerIcon } from "@/components/mark-location/custom-marker-icon";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

const CIRCLE_STYLE = {
  color: "#303030",
  fillColor: "#303030",
  fillOpacity: 0.12,
  weight: 2,
};

const POLYGON_STYLE = {
  color: "#303030",
  fillColor: "#303030",
  fillOpacity: 0.12,
  weight: 2.5,
};

function MapInteractionController({
  areaMode,
  mapTool,
  readOnly,
  fitPreview,
}: {
  areaMode: LocationAreaMode;
  mapTool: MapInteractionTool;
  readOnly: boolean;
  fitPreview: boolean;
}) {
  const map = useMap();
  const isDrawing =
    !readOnly && !fitPreview && areaMode === "freehand" && mapTool === "draw";

  useEffect(() => {
    if (isDrawing) {
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
    } else {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
    }
  }, [isDrawing, map]);

  return null;
}

function CircleClickHandler({
  areaMode,
  readOnly,
  fitPreview,
  onCenterChange,
}: {
  areaMode: LocationAreaMode;
  readOnly: boolean;
  fitPreview: boolean;
  onCenterChange: (center: GeoPoint) => void;
}) {
  useMapEvents({
    click(event) {
      if (readOnly || fitPreview || areaMode !== "circle") return;
      onCenterChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function FreehandDrawHandler({
  active,
  onStrokeChange,
}: {
  active: boolean;
  onStrokeChange: (path: GeoPoint[]) => void;
}) {
  const map = useMap();
  const drawingRef = useRef(false);
  const strokeRef = useRef<GeoPoint[]>([]);
  const onStrokeChangeRef = useRef(onStrokeChange);

  onStrokeChangeRef.current = onStrokeChange;

  useEffect(() => {
    const container = map.getContainer();
    if (!active) return;

    const toGeo = (clientX: number, clientY: number): GeoPoint => {
      const rect = container.getBoundingClientRect();
      const latlng = map.containerPointToLatLng([
        clientX - rect.left,
        clientY - rect.top,
      ]);
      return { lat: latlng.lat, lng: latlng.lng };
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      drawingRef.current = true;
      container.setPointerCapture(event.pointerId);
      const geo = toGeo(event.clientX, event.clientY);
      strokeRef.current = [geo];
      onStrokeChangeRef.current(strokeRef.current);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      const geo = toGeo(event.clientX, event.clientY);
      strokeRef.current = [...strokeRef.current, geo];
      onStrokeChangeRef.current(strokeRef.current);
    };

    const endStroke = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      container.releasePointerCapture(event.pointerId);
      const simplified = simplifyPolygonPath(strokeRef.current);
      strokeRef.current = simplified;
      onStrokeChangeRef.current(simplified);
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", endStroke);
    container.addEventListener("pointercancel", endStroke);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", endStroke);
      container.removeEventListener("pointercancel", endStroke);
    };
  }, [active, map]);

  return null;
}

function FitBounds({
  areaMode,
  center,
  radiusMeters,
  polygonPath,
  fitPreview,
}: {
  areaMode: LocationAreaMode;
  center: GeoPoint;
  radiusMeters: number;
  polygonPath: GeoPoint[];
  fitPreview: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!fitPreview) return;

    if (areaMode === "freehand" && polygonPath.length >= 2) {
      const bounds = polygonPath.map((p) => [p.lat, p.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [40, 40] });
      return;
    }

    if (areaMode === "circle") {
      const latOffset = radiusMeters / 111_320;
      const lngOffset =
        radiusMeters / (111_320 * Math.cos((center.lat * Math.PI) / 180));
      map.fitBounds(
        [
          [center.lat - latOffset, center.lng - lngOffset],
          [center.lat + latOffset, center.lng + lngOffset],
        ],
        { padding: [40, 40] }
      );
    }
  }, [areaMode, center, fitPreview, map, polygonPath, radiusMeters]);

  return null;
}

function MapToolBar({
  mapTool,
  onMapToolChange,
}: {
  mapTool: MapInteractionTool;
  onMapToolChange: (tool: MapInteractionTool) => void;
}) {
  return (
    <div className="absolute right-3 top-3 z-[1000] flex gap-1 rounded-xl border border-[#EBEBEB] bg-white/95 p-1 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-manrope text-xs font-medium transition-colors",
          mapTool === "pan"
            ? "bg-[#303030] text-white"
            : "text-[#717171] hover:bg-[#FAFAFA]"
        )}
        onClick={() => onMapToolChange("pan")}
      >
        <Hand className="size-3.5" strokeWidth={1.5} />
        Move
      </button>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-manrope text-xs font-medium transition-colors",
          mapTool === "draw"
            ? "bg-[#303030] text-white"
            : "text-[#717171] hover:bg-[#FAFAFA]"
        )}
        onClick={() => onMapToolChange("draw")}
      >
        <Pencil className="size-3.5" strokeWidth={1.5} />
        Draw
      </button>
    </div>
  );
}

export type LocationMarkMapProps = {
  areaMode: LocationAreaMode;
  mapTool: MapInteractionTool;
  center: GeoPoint;
  radiusMeters: number;
  polygonPath: GeoPoint[];
  defaultCenter: GeoPoint;
  readOnly?: boolean;
  fitPreview?: boolean;
  onCenterChange: (center: GeoPoint) => void;
  onPolygonChange: (path: GeoPoint[]) => void;
  onMapToolChange?: (tool: MapInteractionTool) => void;
  className?: string;
};

export default function LocationMarkMap({
  areaMode,
  mapTool,
  center,
  radiusMeters,
  polygonPath,
  defaultCenter,
  readOnly = false,
  fitPreview = false,
  onCenterChange,
  onPolygonChange,
  onMapToolChange,
  className,
}: LocationMarkMapProps) {
  const mapCenter =
    center.lat && center.lng ? center : defaultCenter;
  const isDrawing =
    !readOnly && !fitPreview && areaMode === "freehand" && mapTool === "draw";
  const markerIcon = createPickupMarkerIcon();

  const handleCenterChange = useCallback(
    (next: GeoPoint) => {
      onCenterChange(next);
    },
    [onCenterChange]
  );

  const closedPolygon =
    polygonPath.length >= 3
      ? polygonPath.map((p) => [p.lat, p.lng] as [number, number])
      : [];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#EBEBEB] bg-[#E8ECEF] shadow-sm",
        isDrawing && "cursor-crosshair",
        className
      )}
    >
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        className="h-[min(52dvh,420px)] w-full min-h-[280px]"
        scrollWheelZoom={!isDrawing}
        dragging={!isDrawing}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapInteractionController
          areaMode={areaMode}
          mapTool={mapTool}
          readOnly={readOnly}
          fitPreview={fitPreview}
        />

        <CircleClickHandler
          areaMode={areaMode}
          readOnly={readOnly}
          fitPreview={fitPreview}
          onCenterChange={handleCenterChange}
        />

        <FitBounds
          areaMode={areaMode}
          center={mapCenter}
          radiusMeters={radiusMeters}
          polygonPath={polygonPath}
          fitPreview={fitPreview}
        />

        {areaMode === "circle" && (
          <>
            <Circle
              center={[mapCenter.lat, mapCenter.lng]}
              radius={radiusMeters}
              pathOptions={CIRCLE_STYLE}
            />
            <Marker
              position={[mapCenter.lat, mapCenter.lng]}
              icon={markerIcon}
              draggable={!readOnly && !fitPreview}
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target;
                  const { lat, lng } = marker.getLatLng();
                  handleCenterChange({ lat, lng });
                },
              }}
            />
          </>
        )}

        {areaMode === "freehand" && closedPolygon.length >= 3 && (
          <Polygon positions={closedPolygon} pathOptions={POLYGON_STYLE} />
        )}

        {areaMode === "freehand" && polygonPath.length >= 2 && polygonPath.length < 3 && (
          <Polygon
            positions={polygonPath.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{ ...POLYGON_STYLE, fillOpacity: 0 }}
          />
        )}

        {isDrawing && (
          <FreehandDrawHandler
            active
            onStrokeChange={onPolygonChange}
          />
        )}
      </MapContainer>

      {!readOnly && !fitPreview && areaMode === "freehand" && onMapToolChange && (
        <MapToolBar mapTool={mapTool} onMapToolChange={onMapToolChange} />
      )}

      <p className="border-t border-[#EBEBEB] bg-white px-3 py-2 font-manrope text-xs text-[#717171]">
        {areaMode === "circle"
          ? "Tap the map or drag the pin · adjust radius below"
          : mapTool === "draw"
            ? "Trace your preferred area on the map"
            : "Move the map, then switch to Draw to trace your area"}
      </p>
    </div>
  );
}
