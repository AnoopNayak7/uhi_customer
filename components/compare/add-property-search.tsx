"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, MapPin, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { formatPrice } from "./compare-utils";
import type { Property } from "@/lib/store";

interface AddPropertySearchProps {
  compareList: Property[];
  onAdd: (property: Property) => void;
  maxItems?: number;
}

export function AddPropertySearch({
  compareList,
  onAdd,
  maxItems = 3,
}: AddPropertySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const slotsRemaining = maxItems - compareList.length;
  const isFull = slotsRemaining <= 0;

  useEffect(() => {
    if (searchTerm.length <= 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response: any = await apiClient.getProperties({
          search: searchTerm,
          limit: 6,
        });
        setSearchResults(response.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAdd = (property: Property) => {
    if (compareList.some((p) => p.id === property.id)) {
      toast.info("This property is already in your comparison");
      return;
    }
    if (isFull) {
      toast.error(`You can compare up to ${maxItems} properties`);
      return;
    }
    onAdd(property);
    toast.success("Property added to comparison");
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="compare-surface p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="property-section-eyebrow mb-1">Add properties</p>
          <h2 className="font-manrope text-sm font-semibold text-[#1A1A1A] sm:text-base">
            Search and add up to {maxItems} properties
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: maxItems }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-colors ${
                index < compareList.length ? "bg-[#303030]" : "bg-[#E8E8E8]"
              }`}
            />
          ))}
          <span className="font-manrope text-xs font-medium text-[#5C5C5C]">
            {compareList.length}/{maxItems}
          </span>
        </div>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8A8A]"
          strokeWidth={1.5}
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            isFull
              ? "Remove a property to add another"
              : "Search by name, area, or builder..."
          }
          disabled={isFull}
          className="h-11 rounded-[12px] border-[#D0D0D0] bg-[#FAFAFA] pl-10 font-manrope text-base text-[#1A1A1A] placeholder:text-[#A0A0A0] focus-visible:border-[#303030] focus-visible:ring-[#303030]/10 sm:text-sm"
          style={{ fontSize: "16px" }}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[#8A8A8A]" />
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-[12px] border border-[#D0D0D0] bg-white shadow-lg">
          {searchResults.map((property) => {
            const alreadyAdded = compareList.some((p) => p.id === property.id);
            return (
              <div
                key={property.id}
                className="flex items-center gap-3 border-b border-[#D8D8D8] p-3 last:border-b-0"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-[10px] bg-[#F5F5F5]">
                  <Image
                    src={
                      property.images?.[0] ||
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop"
                    }
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-manrope text-sm font-medium text-[#1A1A1A]">
                    {property.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 font-manrope text-xs text-[#5C5C5C]">
                    <MapPin className="size-3 shrink-0" strokeWidth={1.5} />
                    <span className="truncate">
                      {property.city}
                      {property.address ? ` · ${property.address}` : ""}
                    </span>
                  </p>
                  <p className="mt-1 font-manrope text-xs font-semibold text-[#303030]">
                    {formatPrice(property.price)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAdd(property)}
                  disabled={alreadyAdded || isFull}
                  className="h-9 shrink-0 rounded-full bg-[#303030] px-4 font-manrope text-xs text-white hover:bg-[#1a1a1a] disabled:opacity-50"
                >
                  {alreadyAdded ? "Added" : <Plus className="size-3.5" />}
                  {!alreadyAdded && <span className="ml-1.5">Add</span>}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
