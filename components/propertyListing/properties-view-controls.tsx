"use client";

import { Grid3X3, MapIcon } from "lucide-react";

interface MapTypeToggleProps {
  mapType: "map" | "satellite";
  setMapType: (type: "map" | "satellite") => void;
}

export function MapTypeToggle({ mapType, setMapType }: MapTypeToggleProps) {
  return (
    <div className="segment-toggle" role="group" aria-label="Map type">
      <button
        type="button"
        onClick={() => setMapType("map")}
        className={`segment-toggle-btn ${
          mapType === "map" ? "segment-toggle-btn-active" : ""
        }`}
      >
        Map
      </button>
      <button
        type="button"
        onClick={() => setMapType("satellite")}
        className={`segment-toggle-btn ${
          mapType === "satellite" ? "segment-toggle-btn-active" : ""
        }`}
      >
        Satellite
      </button>
    </div>
  );
}

interface ViewModeToggleProps {
  viewMode: "grid" | "map";
  setViewMode: (mode: "grid" | "map") => void;
  className?: string;
}

export function ViewModeToggle({
  viewMode,
  setViewMode,
  className = "",
}: ViewModeToggleProps) {
  return (
    <div
      className={`segment-toggle ${className}`}
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={() => setViewMode("grid")}
        className={`segment-toggle-btn gap-1.5 ${
          viewMode === "grid" ? "segment-toggle-btn-active" : ""
        }`}
      >
        <Grid3X3 className="size-3.5" strokeWidth={1.5} />
        Grid
      </button>
      <button
        type="button"
        onClick={() => setViewMode("map")}
        className={`segment-toggle-btn gap-1.5 ${
          viewMode === "map" ? "segment-toggle-btn-active" : ""
        }`}
      >
        <MapIcon className="size-3.5" strokeWidth={1.5} />
        Map
      </button>
    </div>
  );
}
