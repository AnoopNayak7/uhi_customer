"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { usePropertyStore } from '@/lib/store';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { PropertyCard } from '@/components/propertyListing/PropertyCard';
import { AnimatedPropertyGrid } from '@/components/animations/animated-property-list';
import { MotionWrapper } from '@/components/animations/motion-wrapper';

export default function FavouritesPage() {
  const { favourites, removeFromFavourites } = usePropertyStore();

  const handleRemoveFromFavourites = async (property: any) => {
    try {
      await removeFromFavourites(property.id);
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MotionWrapper variant="fadeInUp">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Favourite Properties
              </h1>
              <p className="text-gray-600">
                {favourites.length} {favourites.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
          </MotionWrapper>

          {favourites.length > 0 ? (
            <AnimatedPropertyGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={() => handleRemoveFromFavourites(property)}
                  isFavorite={true}
                  compact={false}
                />
              ))}
            </AnimatedPropertyGrid>
          ) : (
            <MotionWrapper variant="fadeInUp">
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Favourite Properties Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start browsing properties and save your favorites to see them here.
                </p>
                <Button asChild>
                  <Link href="/properties">
                    Browse Properties
                  </Link>
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