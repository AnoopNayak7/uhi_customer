"use client";

import {
  Circle,
  Hand,
  MapPin,
  Pencil,
  Ruler,
  Target,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  GeoPoint,
  LocationAreaMode,
  MapInteractionTool,
} from "@/lib/location-mark/types";
import {
  formatArea,
  formatAreaSqMeters,
  formatLatLng,
  formatMeters,
  getDiameterMeters,
  getPolygonAreaSqMeters,
  getPolygonCentroid,
} from "@/lib/location-mark/geo-utils";
import { cn } from "@/lib/utils";

type Props = {
  areaMode: LocationAreaMode;
  mapTool: MapInteractionTool;
  center: GeoPoint;
  radiusMeters: number;
  polygonPath: GeoPoint[];
  addressLabel: string;
  note: string;
  mode: "mark" | "confirm";
  onAreaModeChange: (mode: LocationAreaMode) => void;
  onMapToolChange: (tool: MapInteractionTool) => void;
  onRadiusChange: (radius: number) => void;
  onNoteChange: (note: string) => void;
  onClearDrawing?: () => void;
  onContinue?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  onUseMyLocation?: () => void;
  submitting?: boolean;
};

export function LocationSelectionPanel({
  areaMode,
  mapTool,
  center,
  radiusMeters,
  polygonPath,
  addressLabel,
  note,
  mode,
  onAreaModeChange,
  onMapToolChange,
  onRadiusChange,
  onNoteChange,
  onClearDrawing,
  onContinue,
  onBack,
  onSubmit,
  onUseMyLocation,
  submitting,
}: Props) {
  const diameter = getDiameterMeters(radiusMeters);
  const polygonArea = getPolygonAreaSqMeters(polygonPath);
  const polygonCenter = getPolygonCentroid(polygonPath);
  const canContinue = areaMode === "circle" || polygonPath.length >= 3;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-manrope text-base font-semibold text-[#222222]">
          {mode === "mark" ? "Mark your area" : "Confirm your selection"}
        </h2>
        <p className="mt-1 font-manrope text-xs leading-relaxed text-[#717171] sm:text-sm">
          {mode === "mark"
            ? areaMode === "circle"
              ? "Tap the map to place the pin, then adjust the radius."
              : "Pan to your neighbourhood, then draw your preferred boundary."
            : areaMode === "circle"
              ? "Review the shaded circle on the map."
              : "Review the boundary you drew on the map."}
        </p>
      </div>

      {mode === "mark" && onUseMyLocation ? (
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-full border-[#D0D0D0] font-manrope text-sm text-[#303030]"
          onClick={onUseMyLocation}
        >
          <MapPin className="mr-2 size-4" strokeWidth={1.5} />
          Use my current location
        </Button>
      ) : null}

      {mode === "mark" && (
        <div className="grid grid-cols-2 gap-2">
          <ModeButton
            active={areaMode === "circle"}
            label="Radius circle"
            icon={Circle}
            onClick={() => onAreaModeChange("circle")}
          />
          <ModeButton
            active={areaMode === "freehand"}
            label="Draw freehand"
            icon={Pencil}
            onClick={() => onAreaModeChange("freehand")}
          />
        </div>
      )}

      {mode === "mark" && areaMode === "freehand" && (
        <div className="space-y-2">
          <Label className="font-manrope text-xs text-[#484848]">Map tool</Label>
          <div className="grid grid-cols-2 gap-2">
            <ModeButton
              active={mapTool === "pan"}
              label="Move map"
              icon={Hand}
              onClick={() => onMapToolChange("pan")}
            />
            <ModeButton
              active={mapTool === "draw"}
              label="Draw area"
              icon={Pencil}
              onClick={() => onMapToolChange("draw")}
            />
          </div>
          {polygonPath.length > 0 && onClearDrawing ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full rounded-full border-[#D0D0D0] font-manrope text-xs"
              onClick={onClearDrawing}
            >
              <Trash2 className="mr-2 size-3.5" />
              Clear drawing
            </Button>
          ) : null}
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] p-3">
        {areaMode === "circle" ? (
          <>
            <StatRow icon={Target} label="Center" value={formatLatLng(center)} />
            <StatRow
              icon={MapPin}
              label="Area label"
              value={addressLabel || "Tap map to pick a location"}
            />
            <StatRow icon={Ruler} label="Radius" value={formatMeters(radiusMeters)} />
            <StatRow icon={Ruler} label="Diameter" value={formatMeters(diameter)} />
            <StatRow icon={MapPin} label="Coverage" value={formatArea(radiusMeters)} />
          </>
        ) : (
          <>
            <StatRow
              icon={Target}
              label="Shape center"
              value={
                polygonPath.length > 0
                  ? formatLatLng(polygonCenter)
                  : "Not drawn yet"
              }
            />
            <StatRow
              icon={Pencil}
              label="Boundary points"
              value={
                polygonPath.length > 0
                  ? `${polygonPath.length} points`
                  : "Draw on the map"
              }
            />
            <StatRow
              icon={MapPin}
              label="Coverage"
              value={
                polygonPath.length >= 3
                  ? formatAreaSqMeters(polygonArea)
                  : "Need at least 3 points"
              }
            />
          </>
        )}
      </div>

      {mode === "mark" && areaMode === "circle" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="radius-slider" className="font-manrope text-xs text-[#484848]">
              Search radius
            </Label>
            <span className="font-manrope text-xs font-medium text-[#303030]">
              {formatMeters(radiusMeters)}
            </span>
          </div>
          <Input
            id="radius-slider"
            type="range"
            min={300}
            max={5000}
            step={100}
            value={radiusMeters}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[#303030]"
          />
        </div>
      )}

      {mode === "mark" && (
        <div className="space-y-2">
          <Label htmlFor="location-note" className="font-manrope text-xs text-[#484848]">
            Notes (optional)
          </Label>
          <Textarea
            id="location-note"
            rows={2}
            placeholder="Landmark, gate number, or directions for our driver"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="min-h-[72px] resize-none rounded-xl border-[#DDDDDD] font-manrope text-sm"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 pt-1">
        {mode === "mark" ? (
          <Button
            className="property-btn-pill h-11 w-full rounded-full bg-[#303030] font-manrope text-white hover:bg-[#1a1a1a]"
            onClick={onContinue}
            disabled={!canContinue}
          >
            Review selection
          </Button>
        ) : (
          <>
            <Button
              className="property-btn-pill h-11 w-full rounded-full bg-[#303030] font-manrope text-white hover:bg-[#1a1a1a]"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit location"}
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-[#D0D0D0] font-manrope text-sm"
              onClick={onBack}
              disabled={submitting}
            >
              Adjust on map
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof Circle;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 font-manrope text-xs font-medium transition-colors",
        active
          ? "border-[#303030] bg-[#303030] text-white"
          : "border-[#EBEBEB] bg-white text-[#484848] hover:border-[#D0D0D0]"
      )}
    >
      <Icon className="size-4" strokeWidth={1.5} />
      {label}
    </button>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-[#B0B0B0]" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="font-manrope text-[10px] font-medium uppercase tracking-[0.06em] text-[#B0B0B0]">
          {label}
        </p>
        <p className="break-words font-manrope text-sm leading-snug text-[#303030]">
          {value}
        </p>
      </div>
    </div>
  );
}
