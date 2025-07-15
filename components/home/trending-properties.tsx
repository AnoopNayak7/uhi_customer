"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bath, Bed, Square, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { usePropertyStore } from '@/lib/store';
import { toast } from 'sonner';

export function TrendingProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToFavourites, favourites } = usePropertyStore();

  useEffect(() => {
    fetchTrendingProperties();
  }, []);

  const fetchTrendingProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response:any = await apiClient.getProperties({ 
        limit: 4,
        sortBy: 'views', // Sort by most viewed for trending
        order: 'desc',
        city: 'Bangalore'
      });
      
      if (response.success && response.data) {
        setProperties(response.data);
      } else {
        throw new Error('Failed to fetch trending properties');
      }
    } catch (error) {
      console.error('Error fetching trending properties:', error);
      setError('Failed to load trending properties');
      setProperties([]);
      toast.error('Failed to load trending properties');
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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Properties
            </h2>
            <p className="text-gray-600">Loading trending properties...</p>
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Properties
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchTrendingProperties} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Properties
            </h2>
            <p className="text-gray-600 mb-6">No trending properties available at the moment.</p>
            <Button asChild>
              <Link href="/properties">Browse All Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              <TrendingUp className="w-3 h-3 mr-1" />
              Hot Properties
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trending Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Most viewed and enquired properties this week
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images?.[0] || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center`}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 text-white border-0">
                    Trending #{index + 1}
                  </Badge>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-3 right-3 h-8 w-8 p-0 ${
                    favourites.some(p => p.id === property.id) ? 'text-red-500' : 'text-white hover:text-red-500'
                  }`}
                  onClick={() => addToFavourites(property)}
                >
                  <Heart className={`w-4 h-4 ${favourites.some(p => p.id === property.id) ? 'fill-current' : ''}`} />
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
                    {formatPrice(property.price)}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/properties/${property.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
