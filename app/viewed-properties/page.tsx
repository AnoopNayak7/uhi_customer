"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/lib/store';
import { Eye, MapPin, Bath, Bed, Square, Trash2, Clock, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ViewedPropertiesPage() {
  const { viewedProperties, addToFavourites, removeFromFavourites, favourites } = usePropertyStore();
  const router = useRouter();
  const [groupedProperties, setGroupedProperties] = useState<any>({});

  useEffect(() => {
    const grouped = viewedProperties.reduce((acc, property) => {
      const viewDate = new Date().toDateString();
      if (!acc[viewDate]) {
        acc[viewDate] = [];
      }
      acc[viewDate].push(property);
      return acc;
    }, {} as any);
    
    setGroupedProperties(grouped);
  }, [viewedProperties]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleFavorite = (property: any) => {
    const isFavorite = favourites.some(p => p.id === property.id);
    if (isFavorite) {
      removeFromFavourites(property.id);
    } else {
      addToFavourites(property);
    }
  };

  const clearHistory = () => {
    toast.success('Viewing history cleared');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Recently Viewed Properties
              </h1>
              <p className="text-gray-600">
                {viewedProperties.length} {viewedProperties.length === 1 ? 'property' : 'properties'} viewed
              </p>
            </div>
            
            {viewedProperties.length > 0 && (
              <Button variant="outline" onClick={clearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>

          {viewedProperties.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedProperties).map(([date, properties]: [string, any]) => (
                <div key={date}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {date === new Date().toDateString() ? 'Today' : date}
                    </h2>
                    <Badge variant="outline">{properties.length} properties</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property: any) => (
                      <Card 
                        key={property.id} 
                        className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/properties/${property.id}`)}
                      >
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
                            <Badge className="bg-blue-500 text-white border-0">
                              <Eye className="w-3 h-3 mr-1" />
                              Viewed
                            </Badge>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`absolute top-3 right-3 h-8 w-8 p-0 ${
                              favourites.some(p => p.id === property.id) ? 'text-red-500' : 'text-white hover:text-red-500'
                            } bg-black/20 hover:bg-white/90`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(property);
                            }}
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
                            <div className="text-xs text-gray-500">
                              Viewed recently
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Viewed Properties Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start browsing properties to see your viewing history here.
              </p>
              <Button asChild>
                <Link href="/properties">
                  Browse Properties
                </Link>
              </Button>
            </div>
          )}

          {/* Recommendations */}
          {viewedProperties.length > 0 && (
            <div className="mt-16">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Get Personalized Recommendations
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Based on your viewing history, we can suggest similar properties that match your preferences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-blue-500 hover:bg-blue-600" asChild>
                      <Link href="/properties">
                        View Recommendations
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/tools/investment-guide">
                        Get Investment Guide
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}