"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MapPin, X } from "lucide-react";
import { CITIES } from "@/lib/config";
import { useLocationStore } from "@/lib/store";
import { toast } from "sonner";

export function LocationSelector() {
  const { selectedLocation, setSelectedLocation, clearLocation } = useLocationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    city: selectedLocation?.city || "",
    area: selectedLocation?.area || ""
  });

  const handleSave = () => {
    if (!tempLocation.city) {
      toast.error("Please select a city");
      return;
    }
    
    setSelectedLocation({
      city: tempLocation.city,
      area: tempLocation.area
    });
    
    toast.success(`Location updated to ${tempLocation.area ? tempLocation.area + ', ' : ''}${tempLocation.city}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    clearLocation();
    setTempLocation({ city: "", area: "" });
    toast.success("Location cleared");
    setIsOpen(false);
  };

  const handleOpen = () => {
    setTempLocation({
      city: selectedLocation?.city || "",
      area: selectedLocation?.area || ""
    });
    setIsOpen(true);
  };

  return (
    <div className="relative">
      {selectedLocation ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          <span className="truncate max-w-32">
            {selectedLocation.area ? `${selectedLocation.area}, ` : ''}{selectedLocation.city}
          </span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Select Location
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Select
                  value={tempLocation.city}
                  onValueChange={(value) =>
                    setTempLocation((prev) => ({ ...prev, city: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (Optional)
                </label>
                <Input
                  placeholder="e.g., Koramangala, Whitefield"
                  value={tempLocation.area}
                  onChange={(e) =>
                    setTempLocation((prev) => ({ ...prev, area: e.target.value }))
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={!tempLocation.city}
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
