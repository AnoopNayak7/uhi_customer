"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bath, Bed, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
      // Fallback to empty array instead of mock data
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  const defaultImage = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center`;
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={property.images?.[0] || defaultImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {property.isFeatured && (
            <Badge className="bg-yellow-500 text-white border-0">Featured</Badge>
          )}
          {property.isHotSelling && (
            <Badge className="bg-red-500 text-white border-0">Hot</Badge>
          )}
          {property.isNewlyAdded && (
            <Badge className="bg-green-500 text-white border-0">New</Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 h-8 w-8 p-0 ${
            isFavourite ? 'text-red-500' : 'text-white hover:text-red-500'
          }`}
          onClick={onFavourite}
        >
          <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{property.address}, {property.city}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area} {property.areaUnit}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            {property.price}
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/properties/${property.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
