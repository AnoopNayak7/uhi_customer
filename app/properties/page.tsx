"use client";

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useSearchStore, usePropertyStore } from '@/lib/store';
import { PROPERTY_TYPES, CITIES, BHK_OPTIONS, PROPERTY_CATEGORIES } from '@/lib/config';
import { Search, Filter, MapPin, Grid3X3, SlidersHorizontal, Heart, Bath, Bed, Square, Navigation, Loader2, X } from 'lucide-react';
import { Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// Location suggestion interface
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

// Import Map component dynamically to avoid SSR issues
const MapComponent:any = dynamic(() => import('@/components/Map'), { ssr: false });

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
const PropertyCardSkeleton = () => {
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

const PropertyCard = ({ 
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
            <Badge className="bg-green-500 text-white border-0 text-xs font-normal">
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

export default function PropertiesPage() {
  const searchParams:any = useSearchParams();
  const router = useRouter();
  const { searchFilters, updateSearchFilters } = useSearchStore();
  const { addToFavourites, removeFromFavourites, favourites } = usePropertyStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [showFilters, setShowFilters] = useState(false);
  
  // Autocomplete states
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Near me functionality
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Update search filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      updateSearchFilters(params);
    }
    fetchProperties();
  }, [searchParams]);
  
  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
      
      const response: any = await apiClient.getProperties(params);
      
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
    // Handle special "all" values by converting them to empty strings
    const actualValue = value === 'all-cities' || value === 'all-types' || value === 'all-categories' ? '' : value;
    updateSearchFilters({ [key]: actualValue });

    const params = new URLSearchParams(searchParams.toString());
    if (actualValue) {
      params.set(key, actualValue);
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
  
  // Search locations function
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };
  
  // Handle location selection
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Update search filters with selected location
    updateSearchFilters({ 
      ...searchFilters, 
      area: suggestion.display_name
    });
    
    // Store coordinates in local state for map usage
    setUserLocation([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
  };
  
  // Get user's current location
  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        try {
          // Get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setSearchQuery(address);
          
          // Update search filters with current location
          updateSearchFilters({ 
            ...searchFilters, 
            area: address
          });
          
          toast.success('Location updated successfully!');
        } catch (error) {
          console.error('Error getting address:', error);
          toast.error('Failed to get address for your location.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get your location. Please check your browser settings.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for locality, landmark, project or builder"
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-start"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-gray-500" />
                        <span className="text-sm">{suggestion.display_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Select
                value={searchFilters.city || undefined}
                onValueChange={(value) => handleFilterChange('city', value || '')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-cities">All Cities</SelectItem>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleNearMe}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                Near Me
              </Button>
              
              <Button onClick={handleSearch}>Search Properties</Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar Filters */}
            <div className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] self-start">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 lg:mb-0 lg:h-full lg:overflow-y-auto">
                <h3 className="font-medium text-gray-900 mb-4">Filter Properties</h3>
                
                {/* Mobile Filter Toggle Button - Only visible on small screens */}
                <Button 
                  variant="outline" 
                  className="w-full mb-4 flex items-center justify-between lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span>Filter Properties</span>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                
                {/* Filter Content - Hidden on mobile unless toggled */}
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="property-type">
                      <AccordionTrigger className="text-sm font-medium py-2">Property Type</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1">
                          {PROPERTY_TYPES.map((type) => (
                            <div key={type.value} className="flex items-center">
                              <Checkbox 
                                id={`type-${type.value}`} 
                                checked={searchFilters.type === type.value}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('type', type.value);
                                  } else {
                                    handleFilterChange('type', '');
                                  }
                                }}
                              />
                              <label htmlFor={`type-${type.value}`} className="ml-2 text-sm text-gray-600">
                                {type.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="price-range">
                      <AccordionTrigger className="text-sm font-medium py-2">Price Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <Slider 
                            defaultValue={[0, 100]} 
                            max={100} 
                            step={1} 
                            className="my-4"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <Input 
                              type="number" 
                              placeholder="Min" 
                              value={searchFilters.minPrice || ''}
                              onChange={(e) => updateSearchFilters({ minPrice: parseInt(e.target.value) || 0 })}
                              className="w-full"
                            />
                            <span className="text-gray-500">to</span>
                            <Input 
                              type="number" 
                              placeholder="Max" 
                              value={searchFilters.maxPrice || ''}
                              onChange={(e) => updateSearchFilters({ maxPrice: parseInt(e.target.value) || 0 })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="bedrooms">
                      <AccordionTrigger className="text-sm font-medium py-2">Bedrooms</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1">
                          {/* Replace buttons with checkboxes for better scalability */}
                          {[
                            { value: '1', label: '1 BHK' },
                            { value: '2', label: '2 BHK' },
                            { value: '3', label: '3 BHK' },
                            { value: '4', label: '4 BHK' },
                            { value: '5', label: '5 BHK' },
                            { value: '6', label: '6 BHK' },
                            { value: '7', label: '7 BHK' },
                            { value: '8', label: '8 BHK' },
                            { value: '9', label: '9 BHK' },
                            { value: '10+', label: '10+ BHK' }
                          ].map((bhk) => (
                            <div key={bhk.value} className="flex items-center">
                              <Checkbox 
                                id={`bedroom-${bhk.value}`} 
                                checked={searchFilters.bedrooms === bhk.value}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('bedrooms', bhk.value);
                                  } else {
                                    handleFilterChange('bedrooms', '');
                                  }
                                }}
                              />
                              <label htmlFor={`bedroom-${bhk.value}`} className="ml-2 text-sm text-gray-600">
                                {bhk.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="property-category">
                      <AccordionTrigger className="text-sm font-medium py-2">Property Category</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1">
                          {PROPERTY_CATEGORIES.map((category) => (
                            <div key={category.value} className="flex items-center">
                              <Checkbox 
                                id={`category-${category.value}`} 
                                checked={searchFilters.propertyCategory === category.value}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('propertyCategory', category.value);
                                  } else {
                                    handleFilterChange('propertyCategory', '');
                                  }
                                }}
                              />
                              <label htmlFor={`category-${category.value}`} className="ml-2 text-sm text-gray-600">
                                {category.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button className="w-full" onClick={handleSearch}>Apply Filters</Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      updateSearchFilters({
                        type: '',
                        city: '',
                        area: '',
                        minPrice: 0,
                        maxPrice: 0,
                        bedrooms: '',
                        propertyCategory: ''
                      });
                      router.push('/properties');
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
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
                    <MapIcon className="w-4 h-4 mr-2" />
                    Map
                  </Button>
                </div>
              </div>
              
              {/* Properties Content */}
              {viewMode === 'grid' ? (
                <div className="space-y-6">
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
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your search criteria or browse all properties.</p>
                      <Button onClick={() => {
                        updateSearchFilters({
                          type: '',
                          city: '',
                          area: '',
                          minPrice: 0,
                          maxPrice: 0,
                          bedrooms: '',
                          propertyCategory: ''
                        });
                        router.push('/properties');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6 h-[500px] md:h-[600px] lg:h-[700px]">
                  {/* Map */}
                  <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    {properties.length > 0 ? (
                      <div className="relative h-full">
                        <div className="absolute top-2 right-2 z-10 flex space-x-2">
                          <Button variant="outline" size="sm" className="bg-white shadow-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            Bengaluru
                          </Button>
                          <div className="flex rounded-md overflow-hidden border border-gray-200 shadow-sm">
                            <Button 
                              variant={mapType === 'map' ? 'default' : 'outline'} 
                              size="sm" 
                              className={`rounded-none ${mapType === 'map' ? 'bg-primary text-white' : 'bg-white'}`}
                              onClick={() => setMapType('map')}
                            >
                              <MapIcon className="w-4 h-4 mr-1" />
                              Map
                            </Button>
                            <Button 
                              variant={mapType === 'satellite' ? 'default' : 'outline'} 
                              size="sm" 
                              className={`rounded-none ${mapType === 'satellite' ? 'bg-primary text-white' : 'bg-white'}`}
                              onClick={() => setMapType('satellite')}
                            >
                              <MapIcon className="w-4 h-4 mr-1" />
                              Satellite
                            </Button>
                          </div>
                        </div>
                        <MapComponent 
                          center={userLocation || [12.9716, 77.5946]}
                          zoom={12}
                          markers={properties
                            .filter((p: any) => p.latitude && p.longitude)
                            .map((p: any) => ({
                              id: p.id,
                              position: [p.latitude, p.longitude] as [number, number],
                              popupText: p.title
                            }))}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">No properties with location data found.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Property Cards */}
                  <div className="w-full h-80 md:h-auto lg:w-96 overflow-y-auto space-y-4 pr-2 md:pr-4">
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
          </div>
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}