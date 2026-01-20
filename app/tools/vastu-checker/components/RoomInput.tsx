"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Direction,
  RoomType,
  RoomVastu,
  CardinalDirection,
  ROOM_CONFIGS,
  getRoomConfig,
  getDirectionConfig,
} from "@/lib/vastu-types";
import { generateRoomId } from "@/lib/vastu-calculator";
import { DirectionGrid } from "./DirectionGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  BedDouble,
  ChefHat,
  Bath,
  Flame,
  Sofa,
  UtensilsCrossed,
  Archive,
  TreePine,
  BookOpen,
  Car,
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Compass,
} from "lucide-react";

// Icon mapping for room types
const ROOM_ICONS: Record<RoomType, React.ReactNode> = {
  master_bedroom: <Bed className="w-5 h-5" />,
  bedroom: <BedDouble className="w-5 h-5" />,
  kitchen: <ChefHat className="w-5 h-5" />,
  bathroom: <Bath className="w-5 h-5" />,
  puja: <Flame className="w-5 h-5" />,
  living: <Sofa className="w-5 h-5" />,
  dining: <UtensilsCrossed className="w-5 h-5" />,
  store: <Archive className="w-5 h-5" />,
  balcony: <TreePine className="w-5 h-5" />,
  study: <BookOpen className="w-5 h-5" />,
  garage: <Car className="w-5 h-5" />,
  utility: <Wrench className="w-5 h-5" />,
};

interface RoomInputProps {
  rooms: RoomVastu[];
  onRoomsChange: (rooms: RoomVastu[]) => void;
}

interface RoomFormData {
  roomType: RoomType;
  direction: Direction | null;
  sleepingDirection?: CardinalDirection;
  label?: string;
}

export function RoomInput({ rooms, onRoomsChange }: RoomInputProps) {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RoomFormData>({
    roomType: "living",
    direction: null,
    sleepingDirection: undefined,
    label: "",
  });

  const resetForm = () => {
    setFormData({
      roomType: "living",
      direction: null,
      sleepingDirection: undefined,
      label: "",
    });
    setIsAddingRoom(false);
    setEditingRoomId(null);
  };

  const handleAddRoom = () => {
    if (!formData.direction) return;

    const newRoom: RoomVastu = {
      id: generateRoomId(),
      roomType: formData.roomType,
      direction: formData.direction,
      sleepingDirection: formData.sleepingDirection,
      label: formData.label || undefined,
    };

    onRoomsChange([...rooms, newRoom]);
    resetForm();
  };

  const handleUpdateRoom = () => {
    if (!formData.direction || !editingRoomId) return;

    const updatedRooms = rooms.map((room) =>
      room.id === editingRoomId
        ? {
            ...room,
            roomType: formData.roomType,
            direction: formData.direction!,
            sleepingDirection: formData.sleepingDirection,
            label: formData.label || undefined,
          }
        : room
    );

    onRoomsChange(updatedRooms);
    resetForm();
  };

  const handleEditRoom = (room: RoomVastu) => {
    setFormData({
      roomType: room.roomType,
      direction: room.direction,
      sleepingDirection: room.sleepingDirection,
      label: room.label || "",
    });
    setEditingRoomId(room.id);
    setIsAddingRoom(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    onRoomsChange(rooms.filter((room) => room.id !== roomId));
  };

  const roomConfig = getRoomConfig(formData.roomType);
  const hasSleepingDirection = roomConfig?.hasSleepingDirection || false;

  // Create a list of placed rooms for the grid display
  const placedRooms = rooms
    .filter((r) => r.id !== editingRoomId)
    .map((r) => ({
      direction: r.direction,
      roomType: r.roomType,
      label: r.label,
    }));

  return (
    <div className="space-y-6">
      {/* Room List */}
      {rooms.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Added Rooms ({rooms.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rooms.map((room) => {
              const config = getRoomConfig(room.roomType);
              const dirConfig = getDirectionConfig(room.direction);
              const isIdeal = config?.idealDirections.includes(room.direction);
              const isAcceptable = config?.acceptableDirections.includes(room.direction);

              return (
                <Card
                  key={room.id}
                  className={cn(
                    "border-2 transition-all duration-200",
                    isIdeal
                      ? "border-green-300 bg-green-50/50"
                      : isAcceptable
                      ? "border-yellow-300 bg-yellow-50/50"
                      : "border-red-300 bg-red-50/50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            isIdeal
                              ? "bg-green-100 text-green-600"
                              : isAcceptable
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          )}
                        >
                          {ROOM_ICONS[room.roomType]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {room.label || config?.label}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Compass className="w-3 h-3" />
                            {dirConfig?.fullName}
                            {room.sleepingDirection && (
                              <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                Head: {room.sleepingDirection}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRoom(room)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Room Form */}
      {isAddingRoom ? (
        <Card className="border-2 border-purple-200 bg-purple-50/30">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-purple-700">
                {editingRoomId ? "Edit Room" : "Add New Room"}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Room Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Room Type</label>
              <Select
                value={formData.roomType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    roomType: value as RoomType,
                    sleepingDirection: undefined,
                  })
                }
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {ROOM_CONFIGS.map((config) => (
                    <SelectItem key={config.type} value={config.type}>
                      <div className="flex items-center gap-2">
                        {ROOM_ICONS[config.type]}
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Label */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Custom Label (Optional)
              </label>
              <Input
                placeholder={`e.g., "Kids Room", "Guest Bedroom"`}
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="bg-white"
              />
            </div>

            {/* Direction Grid */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Room Direction
              </label>
              <p className="text-xs text-gray-500 mb-3">
                {roomConfig?.description}
              </p>
              <div className="flex justify-center">
                <DirectionGrid
                  selectedDirection={formData.direction}
                  onDirectionSelect={(dir) =>
                    setFormData({ ...formData, direction: dir })
                  }
                  roomType={formData.roomType}
                  placedRooms={placedRooms}
                  size="md"
                />
              </div>
            </div>

            {/* Sleeping Direction (for bedrooms) */}
            {hasSleepingDirection && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sleeping Direction (Head points towards)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["S", "E", "W", "N"] as CardinalDirection[]).map((dir) => {
                    const labels: Record<CardinalDirection, { label: string; color: string }> = {
                      S: { label: "South (Best)", color: "green" },
                      E: { label: "East (Good)", color: "emerald" },
                      W: { label: "West (OK)", color: "yellow" },
                      N: { label: "North (Avoid)", color: "red" },
                    };
                    const info = labels[dir];
                    const isSelected = formData.sleepingDirection === dir;

                    return (
                      <button
                        key={dir}
                        onClick={() =>
                          setFormData({ ...formData, sleepingDirection: dir })
                        }
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                          isSelected
                            ? "border-purple-500 bg-purple-100 ring-2 ring-purple-300"
                            : `border-${info.color}-300 bg-${info.color}-50 hover:bg-${info.color}-100`,
                          dir === "S" && !isSelected && "border-green-300 bg-green-50",
                          dir === "E" && !isSelected && "border-emerald-300 bg-emerald-50",
                          dir === "W" && !isSelected && "border-yellow-300 bg-yellow-50",
                          dir === "N" && !isSelected && "border-red-300 bg-red-50"
                        )}
                      >
                        <div className="font-bold">{dir}</div>
                        <div className="text-[10px] text-gray-600 mt-0.5">
                          {info.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={editingRoomId ? handleUpdateRoom : handleAddRoom}
                disabled={!formData.direction}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                <Check className="w-4 h-4 mr-2" />
                {editingRoomId ? "Update Room" : "Add Room"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingRoom(true)}
          variant="outline"
          className="w-full py-6 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2 text-purple-600" />
          <span className="text-purple-600 font-medium">Add Room</span>
        </Button>
      )}

      {/* Quick add common rooms */}
      {!isAddingRoom && rooms.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-3">
            Start by adding the main rooms of your property
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["living", "master_bedroom", "kitchen", "bathroom"].map((type) => {
              const config = getRoomConfig(type as RoomType);
              return (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, roomType: type as RoomType });
                    setIsAddingRoom(true);
                  }}
                  className="text-xs"
                >
                  {ROOM_ICONS[type as RoomType]}
                  <span className="ml-1">{config?.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
