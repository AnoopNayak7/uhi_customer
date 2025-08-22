"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Helper function to format price
const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString()}`;
};

// Property Card Skeleton Component
export const PropertyCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3">
          <Skeleton className="h-48 w-full" />
        </div>
        <CardContent className="p-4 md:w-2/3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-px w-full mb-4" />
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export const PropertyCard = ({ 
  property, 
  onFavorite, 
  isFavorite,
  compact = false 
}: { 
  property: any;
  onFavorite: () => void;
  isFavorite: boolean;
  compact?: boolean;
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite();
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center';
  
  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer bg-white"
      onClick={handleCardClick}
    >
      <div className={compact ? "flex flex-col" : "flex flex-col md:flex-row"}>
        <div className={compact ? "relative" : "relative md:w-1/3"}>
          <div className={`relative ${compact ? 'h-[200px]' : 'h-48'} overflow-hidden`}>
            <Image
              src={property.images?.[0] || defaultImage}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* <div className="absolute top-3 left-3">
            <Badge className="bg-green-500 text-white border-0 text-xs font-normal">
              Available
            </Badge>
          </div> */}
          
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 h-8 w-8 p-0 ${
              isFavorite ? 'text-red-500' : 'text-white hover:text-red-500'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <CardContent className={compact ? "p-4" : "p-4 md:w-2/3"}>
          <div className="mb-5">
            <h3 className={`font-semibold text-gray-900 line-clamp-2 mb-1 ${compact ? 'text-base' : 'text-[18px]'}`}>
              {property.title}
            </h3>
            <div className="flex items-center text-gray-500 text-xs mt-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.address}, {property.city}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-600 mb-4 mt-3">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} Bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center">
              <Square className="w-3 h-3 mr-1" />
              <span>{property.area} {property.areaUnit}</span>
            </div>
          </div>
          
          <hr className="mb-2" />
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">STARTING PRICE</div>
              <div className="text-lg font-medium text-gray-900">
                {formatPrice(property.price)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">POSSESSION</div>
              <div className="text-sm font-normal text-gray-900">
                {property.possessionDate || 'Ready to Move'}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};