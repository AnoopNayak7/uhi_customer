"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { DeveloperOption } from "./use-developers-filter";

function getDeveloperInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function BuilderFilterCard({
  developer,
  active,
  onClick,
}: {
  developer: DeveloperOption;
  active: boolean;
  onClick: () => void;
}) {
  const initials = getDeveloperInitials(developer.name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-2xl border p-3 text-center transition-all",
        active
          ? "border-[#303030] bg-[#FAFAFA] shadow-[0_0_0_1px_#303030]"
          : "border-[#EBEBEB] bg-white hover:border-[#D0D0D0] hover:bg-[#FAFAFA]"
      )}
    >
      <div className="flex size-14 w-full items-center justify-center">
        {developer.logoUrl ? (
          <Image
            src={developer.logoUrl}
            alt={developer.name}
            width={56}
            height={56}
            className="size-14 object-contain"
            unoptimized
          />
        ) : (
          <span className="font-manrope text-sm font-semibold text-[#484848]">
            {initials}
          </span>
        )}
      </div>
      <span className="line-clamp-2 min-h-[2.5rem] font-manrope text-xs font-medium leading-snug text-[#222222]">
        {developer.name}
      </span>
    </button>
  );
}

export function BuilderFilterGrid({
  developers,
  loading,
  selectedId,
  onSelect,
}: {
  developers: DeveloperOption[];
  loading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[118px] animate-pulse rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA]"
          />
        ))}
      </div>
    );
  }

  if (!developers.length) {
    return (
      <p className="font-manrope text-sm text-[#717171]">No builders found</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {developers.map((developer) => (
        <BuilderFilterCard
          key={developer.id}
          developer={developer}
          active={selectedId === developer.id}
          onClick={() =>
            onSelect(selectedId === developer.id ? "" : developer.id)
          }
        />
      ))}
    </div>
  );
}
