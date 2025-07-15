"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/lib/store';
import { Heart, MapPin, Bath, Bed, Square, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FavouritesPage() {
  const { favourites, removeFromFavourites } = usePropertyStore();
  const router = useRouter();

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Favourite Properties
            </h1>
            <p className="text-gray-600">
              {favourites.length} {favourites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>

          {favourites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((property) => (
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
                      <Badge className="bg-red-500 text-white border-0">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Favourite
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 h-8 w-8 p-0 text-white hover:text-red-500 bg-black/20 hover:bg-white/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavourites(property.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}