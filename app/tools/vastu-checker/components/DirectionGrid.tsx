"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Direction,
  DIRECTION_CONFIGS,
  DIRECTION_GRID_POSITIONS,
  RoomType,
  getRoomConfig,
} from "@/lib/vastu-types";
import { Compass, Check, X, Minus } from "lucide-react";

interface DirectionGridProps {
  selectedDirection: Direction | null;
  onDirectionSelect: (direction: Direction) => void;
  disabled?: boolean;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  highlightIdeal?: Direction[];
  highlightAcceptable?: Direction[];
  highlightAvoid?: Direction[];
  showCompass?: boolean;
  roomType?: RoomType;
  placedRooms?: { direction: Direction; roomType: RoomType; label?: string }[];
}

const GRID_ORDER: Direction[] = ["NW", "N", "NE", "W", "CENTER", "E", "SW", "S", "SE"];

export function DirectionGrid({
  selectedDirection,
  onDirectionSelect,
  disabled = false,
  showLabels = true,
  size = "md",
  highlightIdeal = [],
  highlightAcceptable = [],
  highlightAvoid = [],
  showCompass = true,
  roomType,
  placedRooms = [],
}: DirectionGridProps) {
  // Get room config to show ideal/acceptable/avoid directions
  const roomConfig = roomType ? getRoomConfig(roomType) : null;
  
  const idealDirs = roomConfig?.idealDirections || highlightIdeal;
  const acceptableDirs = roomConfig?.acceptableDirections || highlightAcceptable;
  const avoidDirs = roomConfig?.avoidDirections || highlightAvoid;

  const sizeClasses = {
    sm: "w-16 h-16 text-xs",
    md: "w-20 h-20 text-sm",
    lg: "w-24 h-24 text-base",
  };

  const gapClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  };

  const getDirectionLabel = (direction: Direction): string => {
    const config = DIRECTION_CONFIGS.find((d) => d.direction === direction);
    return showLabels ? config?.label || direction : "";
  };

  const getDirectionFullName = (direction: Direction): string => {
    const config = DIRECTION_CONFIGS.find((d) => d.direction === direction);
    return config?.fullName || direction;
  };

  const getPlacedRoom = (direction: Direction) => {
    return placedRooms.find((r) => r.direction === direction);
  };

  const getCellStyle = (direction: Direction) => {
    const isSelected = selectedDirection === direction;
    const isIdeal = idealDirs.includes(direction);
    const isAcceptable = acceptableDirs.includes(direction);
    const isAvoid = avoidDirs.includes(direction);
    const placedRoom = getPlacedRoom(direction);

    let baseClasses = cn(
      sizeClasses[size],
      "relative rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer",
      "hover:scale-105 hover:shadow-lg",
      disabled && "opacity-50 cursor-not-allowed hover:scale-100"
    );

    if (isSelected) {
      return cn(
        baseClasses,
        "border-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg shadow-purple-500/30 ring-2 ring-purple-400 ring-offset-2"
      );
    }

    if (placedRoom) {
      return cn(
        baseClasses,
        "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100"
      );
    }

    if (isIdeal) {
      return cn(
        baseClasses,
        "border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:border-green-500"
      );
    }

    if (isAcceptable) {
      return cn(
        baseClasses,
        "border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:border-yellow-500"
      );
    }

    if (isAvoid) {
      return cn(
        baseClasses,
        "border-red-300 bg-gradient-to-br from-red-50 to-red-100 hover:border-red-400"
      );
    }

    return cn(
      baseClasses,
      "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50"
    );
  };

  const getIndicator = (direction: Direction) => {
    const isIdeal = idealDirs.includes(direction);
    const isAcceptable = acceptableDirs.includes(direction);
    const isAvoid = avoidDirs.includes(direction);

    if (isIdeal) {
      return (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-white" />
        </div>
      );
    }

    if (isAcceptable) {
      return (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-sm">
          <Minus className="w-3 h-3 text-white" />
        </div>
      );
    }

    if (isAvoid) {
      return (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
          <X className="w-3 h-3 text-white" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center">
      {showCompass && (
        <div className="flex items-center gap-2 mb-4 text-gray-600">
          <Compass className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium">Select Direction</span>
        </div>
      )}

      <div className={cn("grid grid-cols-3", gapClasses[size])}>
        {GRID_ORDER.map((direction) => {
          const placedRoom = getPlacedRoom(direction);
          const placedRoomConfig = placedRoom
            ? getRoomConfig(placedRoom.roomType)
            : null;

          return (
            <button
              key={direction}
              onClick={() => !disabled && onDirectionSelect(direction)}
              disabled={disabled}
              className={getCellStyle(direction)}
              title={`${getDirectionFullName(direction)}${
                placedRoom
                  ? ` - ${placedRoom.label || placedRoomConfig?.label}`
                  : ""
              }`}
            >
              {(roomConfig || highlightIdeal.length > 0) && getIndicator(direction)}
              
              <span
                className={cn(
                  "font-bold",
                  selectedDirection === direction
                    ? "text-purple-700"
                    : placedRoom
                    ? "text-blue-700"
                    : "text-gray-700"
                )}
              >
                {getDirectionLabel(direction)}
              </span>

              {placedRoom && (
                <span className="text-[10px] text-blue-600 mt-0.5 truncate max-w-full px-1">
                  {placedRoom.label || placedRoomConfig?.label}
                </span>
              )}

              {direction === "CENTER" && !placedRoom && (
                <span className="text-[10px] text-gray-400 mt-0.5">Center</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {(roomConfig || highlightIdeal.length > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-gray-600">Ideal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <Minus className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-gray-600">Acceptable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-gray-600">Avoid</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact direction selector for entry selection
export function EntryDirectionSelector({
  selectedDirection,
  onDirectionSelect,
  disabled = false,
}: {
  selectedDirection: Direction | null;
  onDirectionSelect: (direction: Direction) => void;
  disabled?: boolean;
}) {
  // Entry directions (excluding CENTER)
  const entryDirections: Direction[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  // Entry scores for color coding
  const entryScores: Record<Direction, number> = {
    N: 90,
    NE: 100,
    E: 95,
    SE: 60,
    S: 20,
    SW: 10,
    W: 70,
    NW: 65,
    CENTER: 50,
  };

  const getEntryColor = (direction: Direction) => {
    const score = entryScores[direction];
    if (score >= 90) return "bg-green-100 border-green-400 hover:bg-green-200";
    if (score >= 70) return "bg-emerald-100 border-emerald-400 hover:bg-emerald-200";
    if (score >= 60) return "bg-yellow-100 border-yellow-400 hover:bg-yellow-200";
    if (score >= 30) return "bg-orange-100 border-orange-400 hover:bg-orange-200";
    return "bg-red-100 border-red-400 hover:bg-red-200";
  };

  const getEntryLabel = (direction: Direction) => {
    const score = entryScores[direction];
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 30) return "Poor";
    return "Avoid";
  };

  const getDirectionFullName = (direction: Direction): string => {
    const config = DIRECTION_CONFIGS.find((d) => d.direction === direction);
    return config?.fullName || direction;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {entryDirections.map((direction) => (
          <button
            key={direction}
            onClick={() => !disabled && onDirectionSelect(direction)}
            disabled={disabled}
            className={cn(
              "relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center",
              "hover:scale-105 hover:shadow-md",
              disabled && "opacity-50 cursor-not-allowed hover:scale-100",
              selectedDirection === direction
                ? "border-purple-500 bg-purple-100 ring-2 ring-purple-400 ring-offset-2 shadow-lg"
                : getEntryColor(direction)
            )}
            title={`${getDirectionFullName(direction)} - ${getEntryLabel(direction)}`}
          >
            <span
              className={cn(
                "font-bold text-lg",
                selectedDirection === direction ? "text-purple-700" : "text-gray-700"
              )}
            >
              {direction}
            </span>
            <span
              className={cn(
                "text-[10px] mt-0.5",
                selectedDirection === direction ? "text-purple-600" : "text-gray-500"
              )}
            >
              {getEntryLabel(direction)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
