import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Bath, Square, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface FloorPlan {
  label: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  carpetArea: number;
  balconyCount: number;
  image: string;
}

interface FloorPlansProps {
  floorPlans: FloorPlan[];
}

export const FloorPlans = ({ floorPlans }: FloorPlansProps) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!floorPlans || floorPlans.length === 0) {
    return null;
  }
  
  const visiblePlans = showAll ? floorPlans : floorPlans.slice(0, 3);
  const hasMorePlans = floorPlans.length > 3;
  
  return (
    <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold mb-4 text-gray-900">Floor Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {visiblePlans.map((plan, index) => (
          <Card key={index} className="border border-gray-200 overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100">
              {plan.image ? (
                <Image 
                  src={plan.image} 
                  alt={plan.label} 
                  fill 
                  className="object-contain" 
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Square className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm mb-2">{plan.label}</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                  <Bed className="w-3 h-3 mb-1" />
                  <span className="text-[10px] whitespace-nowrap">{plan.bedrooms} BHK</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                  <Bath className="w-3 h-3 mb-1" />
                  <span className="text-[10px] whitespace-nowrap">{plan.bathrooms} Bath</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                  <Square className="w-3 h-3 mb-1" />
                  <span className="text-[10px] whitespace-nowrap">{plan.builtUpArea} sqft</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {hasMorePlans && (
        <div className="text-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show More ({floorPlans.length - 3} more)
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
};