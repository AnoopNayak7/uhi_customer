import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bath, Bed, Square, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SimilarPropertiesProps {
  properties: any[];
  formatPrice: (price: number) => string;
}

export const SimilarProperties = ({ properties, formatPrice }: SimilarPropertiesProps) => {
  if (!properties || properties.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Similar Properties</h3>
          <Link href="/properties" passHref>
            <Button variant="ghost" size="sm" className="text-xs h-8">
              View More
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property, index) => (
            <Link href={`/properties/${property.id}`} key={index} passHref>
              <div className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative h-36 w-full bg-gray-100">
                  {property.image ? (
                    <Image 
                      src={property.image} 
                      alt={property.title} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Square className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-500 text-white border-0 text-xs">
                      For {property.propertyType === 'sell' ? 'Sale' : 'Rent'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{property.title}</h4>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-primary">{formatPrice(property.price)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-3 h-3 mr-1" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Bath className="w-3 h-3 mr-1" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Square className="w-3 h-3 mr-1" />
                      <span>{Array.isArray(property.builtUpArea) ? property.builtUpArea[0] : property.builtUpArea} sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};