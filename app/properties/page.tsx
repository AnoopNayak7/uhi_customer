"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useSearchStore, usePropertyStore } from '@/lib/store';
import { PROPERTY_TYPES, CITIES, BHK_OPTIONS, PROPERTY_CATEGORIES } from '@/lib/config';
import { Search, Filter, MapPin, Grid3X3, Map, SlidersHorizontal, Heart, Bath, Bed, Square } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { toast } from 'sonner';

export default function PropertiesPage() {
  const searchParams:any = useSearchParams();
  const router = useRouter();
  const { searchFilters, updateSearchFilters } = useSearchStore();
  const { addToFavourites, removeFromFavourites, favourites } = usePropertyStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Update search filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      updateSearchFilters(params);
    }
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      // Convert URL search params to API params
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          params[key] = value;
        }
      }
      
      if (!params.limit) params.limit = 20;
      if (!params.page) params.page = 1;
      
      const response:any = await apiClient.getProperties(params);
      
      if (response.success && response.data) {
        setProperties(response.data);
      } else {
        throw new Error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    updateSearchFilters({ [key]: value });

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Navigate to new URL with updated params
    router.push(`/properties?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Add all current search filters to params
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 0) {
        params.append(key, value.toString());
      }
    });
    
    router.push(`/properties?${params.toString()}`);
  };

  const handleFavorite = (property: any) => {
    const isFavorite = favourites.some(p => p.id === property.id);
    if (isFavorite) {
      removeFromFavourites(property.id);
    } else {
      addToFavourites(property);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Available Properties</h1>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `Showing ${properties.length} properties in ${searchFilters.city || 'All Cities'}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Single Row */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Main Filter Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Search Bar */}
              <div className="lg:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for locality, landmark, project or builder"
                    className="pl-10"
                    value={searchFilters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="lg:col-span-1">
                <Select 
                  value={searchFilters.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-1">
                <Select 
                  value={searchFilters.city}
                  onValueChange={(value) => handleFilterChange('city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
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

              <div className="lg:col-span-1">
                <Select 
                  value={searchFilters.bedrooms}
                  onValueChange={(value) => handleFilterChange('bedrooms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    {BHK_OPTIONS.map((bhk) => (
                      <SelectItem key={bhk.value} value={bhk.value}>
                        {bhk.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="lg:col-span-1">
                <Input 
                  type="number" 
                  placeholder="Min Price"
                  value={searchFilters.minPrice || ''}
                  onChange={(e) => updateSearchFilters({ minPrice: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="lg:col-span-1">
                <Input 
                  type="number" 
                  placeholder="Max Price"
                  value={searchFilters.maxPrice || ''}
                  onChange={(e) => updateSearchFilters({ maxPrice: parseInt(e.target.value) || 100000000 })}
                />
              </div>

              <div className="lg:col-span-1">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  More
                </Button>
              </div>

              <div className="lg:col-span-2">
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Category
                    </label>
                    <Select 
                      value={searchFilters.propertyCategory}
                      onValueChange={(value) => handleFilterChange('propertyCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeleton
                [...Array(6)].map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))
              ) : properties.length > 0 ? (
                properties.map((property: any) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onFavorite={() => handleFavorite(property)}
                    isFavorite={favourites.some(p => p.id === property.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search criteria or browse all properties.</p>
                    <Button onClick={() => {
                      updateSearchFilters({
                        type: 'sell',
                        city: '',
                        area: '',
                        minPrice: 0,
                        maxPrice: 100000000,
                        bedrooms: '',
                        propertyCategory: ''
                      });
                      router.push('/properties');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-6 h-[600px]">
              {/* Map */}
              <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map view coming soon...</p>
              </div>
              
              {/* Property Cards */}
              <div className="w-96 overflow-y-auto space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))
                ) : properties.length > 0 ? (
                  properties.map((property: any) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      onFavorite={() => handleFavorite(property)}
                      isFavorite={favourites.some(p => p.id === property.id)}
                      compact
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No properties found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-4" />
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyCard({ 
  property, 
  onFavorite, 
  isFavorite,
  compact = false 
}: { 
  property: any;
  onFavorite: () => void;
  isFavorite: boolean;
  compact?: boolean;
}) {
  const router = useRouter();

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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite();
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center';
  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className={`relative ${compact ? 'h-32' : 'h-48'} overflow-hidden`}>
          <Image
            src={property.images?.[0] || defaultImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-500 text-white border-0">
            Available
          </Badge>
        </div>
        
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
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className={`font-semibold text-gray-900 line-clamp-2 mb-1 ${compact ? 'text-base' : 'text-lg'}`}>
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
          <div className={`font-bold text-gray-900 ${compact ? 'text-lg' : 'text-xl'}`}>
            {formatPrice(property.price)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
