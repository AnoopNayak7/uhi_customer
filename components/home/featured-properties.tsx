"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bath, Bed, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { usePropertyStore } from '@/lib/store';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  images?: string[];
  isFeatured?: boolean;
  isHotSelling?: boolean;
  isFastSelling?: boolean;
  isNewlyAdded?: boolean;
}

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToFavourites, favourites } = usePropertyStore();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response:any = await apiClient.getProperties({ 
        isFeatured: true, 
        limit: 8,
        city: 'Bangalore'
      });
      
      if (response.success && response.data) {
        setProperties(response.data);
      } else {
        throw new Error('Failed to fetch featured properties');
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setError('Failed to load featured properties');
      setProperties([]);
      toast.error('Failed to load featured properties');
    } finally {
      setLoading(false);
    }
  };



  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(properties.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(properties.length / 4)) % Math.ceil(properties.length / 4));
  };

  const visibleProperties = properties.slice(currentSlide * 4, (currentSlide + 1) * 4);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties in Bangalore
            </h2>
            <p className="text-gray-600">Loading featured properties...</p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-4" />
                    <div className="h-6 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties in Bangalore
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchFeaturedProperties} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties in Bangalore
            </h2>
            <p className="text-gray-600 mb-6">No featured properties available at the moment.</p>
            <Button asChild>
              <Link href="/properties">Browse All Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties in Bangalore
            </h2>
            <p className="text-gray-600">
              Handpicked premium properties for discerning buyers
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={properties.length <= 4}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={properties.length <= 4}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {visibleProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavourite={() => addToFavourites(property)}
                isFavourite={favourites.some(p => p.id === property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No properties to display</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/properties">View All Properties</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ 
  property, 
  onFavourite, 
  isFavourite 
}: { 
  property: Property;
  onFavourite: () => void;
  isFavourite: boolean;
}) {
  const router = useRouter();
  const defaultImage = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center`;
  
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavourite();
  };

  return (
    <Card 
      className="group cursor-pointer bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Image Container with perfect aspect ratio */}
        <div className="relative h-44 overflow-hidden rounded-t-xl">
          <Image
            src={property.images?.[0] || defaultImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
        
        {/* Badges - Modern pill design */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {property.isFeatured && (
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              Featured
            </Badge>
          )}
          {property.isHotSelling && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              Hot
            </Badge>
          )}
          {property.isNewlyAdded && (
            <Badge className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              New
            </Badge>
          )}
        </div>
        
        {/* Heart Button - Improved positioning */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all ${
            isFavourite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
          onClick={handleFavouriteClick}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavourite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1 mb-1.5 leading-tight">
            {property.title}
          </h3>
          <div className="flex items-start text-gray-500 text-xs">
            <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1 leading-relaxed">{property.address}, {property.city}</span>
          </div>
        </div>
        
        {/* Property Features - Compact grid */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="w-3 h-3 mr-1 text-gray-400" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-3 h-3 mr-1 text-gray-400" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-3 h-3 mr-1 text-gray-400" />
              <span className="font-medium">{property.area} {property.areaUnit}</span>
            </div>
          </div>
        </div>
        
        {/* Price */}
        <div className="pt-2 border-t border-gray-100">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}