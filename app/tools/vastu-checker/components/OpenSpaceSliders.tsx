"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { OpenSpaces } from "@/lib/vastu-types";
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Sun, Wind } from "lucide-react";

interface OpenSpaceSlidersProps {
  openSpaces: OpenSpaces;
  onOpenSpacesChange: (openSpaces: OpenSpaces) => void;
}

const DIRECTION_INFO = {
  north: {
    label: "North",
    icon: ArrowUp,
    description: "Should have MORE open space",
    ideal: "high",
    color: "blue",
  },
  south: {
    label: "South",
    icon: ArrowDown,
    description: "Should have LESS open space",
    ideal: "low",
    color: "orange",
  },
  east: {
    label: "East",
    icon: ArrowRight,
    description: "Should have MORE open space (sunrise)",
    ideal: "high",
    color: "yellow",
  },
  west: {
    label: "West",
    icon: ArrowLeft,
    description: "Should have LESS open space",
    ideal: "low",
    color: "purple",
  },
};

export function OpenSpaceSliders({
  openSpaces,
  onOpenSpacesChange,
}: OpenSpaceSlidersProps) {
  const handleChange = (direction: keyof OpenSpaces, value: number) => {
    onOpenSpacesChange({
      ...openSpaces,
      [direction]: value,
    });
  };

  const getSliderColor = (direction: keyof OpenSpaces, value: number) => {
    const info = DIRECTION_INFO[direction];
    const isIdeal =
      (info.ideal === "high" && value >= 4) ||
      (info.ideal === "low" && value <= 2);
    const isGood =
      (info.ideal === "high" && value >= 3) ||
      (info.ideal === "low" && value <= 3);

    if (isIdeal) return "bg-green-500";
    if (isGood) return "bg-yellow-500";
    return "bg-red-400";
  };

  const getComparisonStatus = () => {
    const northSouthGood = openSpaces.north > openSpaces.south;
    const eastWestGood = openSpaces.east > openSpaces.west;

    return { northSouthGood, eastWestGood };
  };

  const status = getComparisonStatus();

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Open Space Distribution</h4>
        <p className="text-sm text-gray-500">
          Rate the amount of open space in each direction (1 = Minimal, 5 = Maximum)
        </p>
      </div>

      {/* Visual Representation */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        {/* Center house */}
        <div className="absolute inset-1/4 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm font-medium">House</span>
        </div>

        {/* North space */}
        <div
          className={cn(
            "absolute top-0 left-1/4 right-1/4 h-1/4 rounded-t-lg flex items-center justify-center transition-all duration-300",
            openSpaces.north >= 4
              ? "bg-blue-200"
              : openSpaces.north >= 3
              ? "bg-blue-100"
              : "bg-blue-50"
          )}
          style={{ opacity: 0.3 + openSpaces.north * 0.14 }}
        >
          <ArrowUp className="w-6 h-6 text-blue-600" />
        </div>

        {/* South space */}
        <div
          className={cn(
            "absolute bottom-0 left-1/4 right-1/4 h-1/4 rounded-b-lg flex items-center justify-center transition-all duration-300",
            openSpaces.south >= 4
              ? "bg-orange-200"
              : openSpaces.south >= 3
              ? "bg-orange-100"
              : "bg-orange-50"
          )}
          style={{ opacity: 0.3 + openSpaces.south * 0.14 }}
        >
          <ArrowDown className="w-6 h-6 text-orange-600" />
        </div>

        {/* East space */}
        <div
          className={cn(
            "absolute right-0 top-1/4 bottom-1/4 w-1/4 rounded-r-lg flex items-center justify-center transition-all duration-300",
            openSpaces.east >= 4
              ? "bg-yellow-200"
              : openSpaces.east >= 3
              ? "bg-yellow-100"
              : "bg-yellow-50"
          )}
          style={{ opacity: 0.3 + openSpaces.east * 0.14 }}
        >
          <Sun className="w-6 h-6 text-yellow-600" />
        </div>

        {/* West space */}
        <div
          className={cn(
            "absolute left-0 top-1/4 bottom-1/4 w-1/4 rounded-l-lg flex items-center justify-center transition-all duration-300",
            openSpaces.west >= 4
              ? "bg-purple-200"
              : openSpaces.west >= 3
              ? "bg-purple-100"
              : "bg-purple-50"
          )}
          style={{ opacity: 0.3 + openSpaces.west * 0.14 }}
        >
          <Wind className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(DIRECTION_INFO) as Array<keyof typeof DIRECTION_INFO>).map(
          (direction) => {
            const info = DIRECTION_INFO[direction];
            const Icon = info.icon;
            const value = openSpaces[direction];

            return (
              <div
                key={direction}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        `bg-${info.color}-100 text-${info.color}-600`,
                        direction === "north" && "bg-blue-100 text-blue-600",
                        direction === "south" && "bg-orange-100 text-orange-600",
                        direction === "east" && "bg-yellow-100 text-yellow-600",
                        direction === "west" && "bg-purple-100 text-purple-600"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{info.label}</div>
                      <div className="text-xs text-gray-500">{info.description}</div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      direction === "north" && "text-blue-600",
                      direction === "south" && "text-orange-600",
                      direction === "east" && "text-yellow-600",
                      direction === "west" && "text-purple-600"
                    )}
                  >
                    {value}
                  </div>
                </div>

                {/* Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={value}
                    onChange={(e) =>
                      handleChange(direction, parseInt(e.target.value))
                    }
                    className={cn(
                      "w-full h-2 rounded-lg appearance-none cursor-pointer",
                      "bg-gray-200",
                      "[&::-webkit-slider-thumb]:appearance-none",
                      "[&::-webkit-slider-thumb]:w-5",
                      "[&::-webkit-slider-thumb]:h-5",
                      "[&::-webkit-slider-thumb]:rounded-full",
                      "[&::-webkit-slider-thumb]:cursor-pointer",
                      "[&::-webkit-slider-thumb]:transition-all",
                      "[&::-webkit-slider-thumb]:hover:scale-110",
                      direction === "north" &&
                        "[&::-webkit-slider-thumb]:bg-blue-500",
                      direction === "south" &&
                        "[&::-webkit-slider-thumb]:bg-orange-500",
                      direction === "east" &&
                        "[&::-webkit-slider-thumb]:bg-yellow-500",
                      direction === "west" &&
                        "[&::-webkit-slider-thumb]:bg-purple-500"
                    )}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Minimal</span>
                    <span className="text-xs text-gray-400">Maximum</span>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Comparison Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div
          className={cn(
            "p-4 rounded-xl border-2 transition-all duration-300",
            status.northSouthGood
              ? "border-green-300 bg-green-50"
              : openSpaces.north === openSpaces.south
              ? "border-yellow-300 bg-yellow-50"
              : "border-red-300 bg-red-50"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp className="w-4 h-4 text-blue-500" />
            <span className="font-medium">vs</span>
            <ArrowDown className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-sm font-medium">
            {status.northSouthGood ? (
              <span className="text-green-700">North has more space than South ✓</span>
            ) : openSpaces.north === openSpaces.south ? (
              <span className="text-yellow-700">North = South (should be N {">"} S)</span>
            ) : (
              <span className="text-red-700">South has more space (should be N {">"} S)</span>
            )}
          </div>
        </div>

        <div
          className={cn(
            "p-4 rounded-xl border-2 transition-all duration-300",
            status.eastWestGood
              ? "border-green-300 bg-green-50"
              : openSpaces.east === openSpaces.west
              ? "border-yellow-300 bg-yellow-50"
              : "border-red-300 bg-red-50"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">vs</span>
            <ArrowLeft className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-sm font-medium">
            {status.eastWestGood ? (
              <span className="text-green-700">East has more space than West ✓</span>
            ) : openSpaces.east === openSpaces.west ? (
              <span className="text-yellow-700">East = West (should be E {">"} W)</span>
            ) : (
              <span className="text-red-700">West has more space (should be E {">"} W)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
