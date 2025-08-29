"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore, useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PropertyCard } from '@/components/propertyListing/PropertyCard';
import { AnimatedPropertyGrid } from '@/components/animations/animated-property-list';
import { MotionWrapper } from '@/components/animations/motion-wrapper';
import { toast } from 'sonner';

export default function ViewedPropertiesPage() {
  const { addToFavourites, removeFromFavourites, favourites } = usePropertyStore();
  const { user } = useAuthStore();
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
          <MotionWrapper variant="fadeInUp">
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
          </MotionWrapper>

          {/* Properties Grid */}
          {loading ? (
            <AnimatedPropertyGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded mb-4" />
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatedPropertyGrid>
          ) : viewedProperties.length > 0 ? (
            <>
              <AnimatedPropertyGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {viewedProperties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={() => handleFavorite(property)}
                    isFavorite={favourites.some(p => p.id === property.id)}
                    compact={false}
                  />
                ))}
              </AnimatedPropertyGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <MotionWrapper variant="fadeInUp">
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
                </MotionWrapper>
              )}
            </>
          ) : (
            <MotionWrapper variant="fadeInUp">
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
            </MotionWrapper>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}