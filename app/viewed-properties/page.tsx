"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore, useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { Eye, MapPin, Bath, Bed, Square, Trash2, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ViewedPropertiesPage() {
  const { addToFavourites, removeFromFavourites, favourites } = usePropertyStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [viewedProperties, setViewedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    if (user) {
      fetchViewedProperties();
    }
  }, [user, currentPage]);

  const fetchViewedProperties = async () => {
    try {
      setLoading(true);
      const response: any = await apiClient.getViewedProperties(user?.id || '', itemsPerPage);
      
      if (response.success) {
        setViewedProperties(response.data || []);
        // Calculate total pages based on total count
        const total = response.data?.length || 0;
        setTotalCount(total);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } else {
        toast.error('Failed to fetch viewed properties');
      }
    } catch (error) {
      console.error('Error fetching viewed properties:', error);
      toast.error('Failed to fetch viewed properties');
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

  const handleFavorite = async (property: any) => {
    if (!user) {
      toast.error('Please login to add favourites');
      return;
    }

    try {
      const isFavorite = favourites.some(p => p.id === property.id);
      if (isFavorite) {
        await apiClient.removeFromFavourites(property.id);
        removeFromFavourites(property.id);
        toast.success('Property removed from favourites');
      } else {
        await apiClient.addToFavourites(property.id);
        addToFavourites(property);
        toast.success('Property added to favourites');
      }
    } catch (error) {
      console.error('Error updating favourite:', error);
      toast.error('Failed to update favourite');
    }
  };

  const clearHistory = () => {
    toast.success('Viewing history cleared');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your property history.</p>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Viewed Properties</h1>
                <p className="text-gray-600 mt-2">
                  Track your property viewing history and manage your interests
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm">
                  {totalCount} properties
                </Badge>
                <Button variant="outline" onClick={clearHistory}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            renderSkeleton()
          ) : viewedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {viewedProperties.map((property: any) => (
                  <Card 
                    key={property.id} 
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/properties/${property.id}`)}
                  >
                    <div className="relative">
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        {property.images && property.images[0] ? (
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Eye className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(property);
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favourites.some(p => p.id === property.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-600'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">
                          {property.address}, {property.city}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
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
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600 text-lg">
                          {formatPrice(property.price)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {property.propertyType || 'Property'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No viewed properties yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring properties to build your viewing history
              </p>
              <Button asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}