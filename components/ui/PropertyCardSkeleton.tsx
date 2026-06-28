import React from "react";

export const PropertyCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-white">
      <div className="aspect-[5/4] bg-[#F0F0F0]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-[#F0F0F0]" />
        <div className="h-3 w-1/2 rounded bg-[#F5F5F5]" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 w-16 rounded bg-[#F5F5F5]" />
          <div className="h-3 w-16 rounded bg-[#F5F5F5]" />
        </div>
        <div className="border-t border-[#F0F0F0] pt-3">
          <div className="h-4 w-24 rounded bg-[#F0F0F0]" />
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton = ({ count = 9 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
};
