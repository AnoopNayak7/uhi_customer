import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Price skeleton */}
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Location skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        {/* Features skeleton */}
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Bottom section skeleton */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton = ({ count = 9 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
};
