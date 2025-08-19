"use client";
// @ts-ignore

import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const NearbyPlaces:any = dynamic(() => import('@/components/NearbyPlaces'), { ssr: false });

interface PropertyLocationProps {
  property: any;
}

export const PropertyLocation = ({ property }: PropertyLocationProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <h3 className="text-base font-semibold mb-4">Location</h3>
        
        <div className="flex items-start mb-4">
          <MapPin className="w-5 h-5 text-primary mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">{property.address}</h4>
            <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
          </div>
        </div>
        
        <div className="h-[300px] rounded-lg overflow-hidden mb-6">
          {property.location && property.location.latitude && property.location.longitude ? (
            
            <Map 
              center={[property.location.latitude, property.location.longitude]} 
              zoom={15} 
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Map location not available</p>
            </div>
          )}
        </div>
        
        {property.location && property.location.latitude && property.location.longitude && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-3">Nearby Places</h4>
            <NearbyPlaces 
              center={[property.latitude, property.longitude]}
              locationName={property.address}
              radius={2}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};