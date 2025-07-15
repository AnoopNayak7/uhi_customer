"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyFormData } from '../property-wizard';
import { 
  Car, 
  Shield, 
  Dumbbell, 
  Waves, 
  Trees, 
  Zap, 
  Wifi, 
  Wind,
  Building,
  Users,
  ShoppingCart,
  Gamepad2
} from 'lucide-react';

interface AmenitiesStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

const amenityCategories = [
  {
    title: 'Security & Safety',
    amenities: [
      { id: 'security', label: '24/7 Security', icon: Shield },
      { id: 'cctv', label: 'CCTV Surveillance', icon: Shield },
      { id: 'gated_community', label: 'Gated Community', icon: Building },
      { id: 'fire_safety', label: 'Fire Safety', icon: Shield }
    ]
  },
  {
    title: 'Parking & Transportation',
    amenities: [
      { id: 'parking', label: 'Car Parking', icon: Car },
      { id: 'visitor_parking', label: 'Visitor Parking', icon: Car },
      { id: 'bike_parking', label: 'Bike Parking', icon: Car }
    ]
  },
  {
    title: 'Recreation & Fitness',
    amenities: [
      { id: 'gym', label: 'Gymnasium', icon: Dumbbell },
      { id: 'swimming_pool', label: 'Swimming Pool', icon: Waves },
      { id: 'clubhouse', label: 'Clubhouse', icon: Building },
      { id: 'playground', label: 'Children\'s Play Area', icon: Gamepad2 },
      { id: 'sports_facility', label: 'Sports Facility', icon: Gamepad2 }
    ]
  },
  {
    title: 'Utilities & Services',
    amenities: [
      { id: 'power_backup', label: 'Power Backup', icon: Zap },
      { id: 'lift', label: 'Elevator/Lift', icon: Building },
      { id: 'water_supply', label: '24/7 Water Supply', icon: Waves },
      { id: 'internet', label: 'Internet/Wi-Fi', icon: Wifi },
      { id: 'ac', label: 'Air Conditioning', icon: Wind }
    ]
  },
  {
    title: 'Outdoor & Environment',
    amenities: [
      { id: 'garden', label: 'Garden/Landscaping', icon: Trees },
      { id: 'terrace', label: 'Terrace Garden', icon: Trees },
      { id: 'balcony', label: 'Balcony', icon: Building }
    ]
  },
  {
    title: 'Community & Shopping',
    amenities: [
      { id: 'community_hall', label: 'Community Hall', icon: Users },
      { id: 'shopping_center', label: 'Shopping Center', icon: ShoppingCart },
      { id: 'medical_facility', label: 'Medical Facility', icon: Building }
    ]
  }
];

export function AmenitiesStep({ formData, updateFormData }: AmenitiesStepProps) {
  const toggleAmenity = (amenityId: string) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = currentFeatures.includes(amenityId)
      ? currentFeatures.filter(id => id !== amenityId)
      : [...currentFeatures, amenityId];
    
    updateFormData({ features: updatedFeatures });
  };

  const isSelected = (amenityId: string) => {
    return formData.features?.includes(amenityId) || false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Amenities & Features
        </h3>
        <p className="text-gray-600 mb-6">
          Select all the amenities and features available in your property.
        </p>
      </div>

      {/* Selected Count */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Selected Amenities: {formData.features?.length || 0}
          </span>
          {formData.features && formData.features.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFormData({ features: [] })}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Amenity Categories */}
      <div className="space-y-8">
        {amenityCategories.map((category) => (
          <div key={category.title}>
            <h4 className="font-medium text-gray-900 mb-4">{category.title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.amenities.map((amenity) => (
                <Button
                  key={amenity.id}
                  variant={isSelected(amenity.id) ? "default" : "outline"}
                  className={`h-auto p-3 flex flex-col items-center space-y-2 ${
                    isSelected(amenity.id) 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'hover:border-red-300'
                  }`}
                  onClick={() => toggleAmenity(amenity.id)}
                >
                  <amenity.icon className="w-5 h-5" />
                  <span className="text-xs text-center leading-tight">
                    {amenity.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Amenities Summary */}
      {formData.features && formData.features.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Selected Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((featureId) => {
              const amenity = amenityCategories
                .flatMap(cat => cat.amenities)
                .find(a => a.id === featureId);
              
              return amenity ? (
                <Badge key={featureId} variant="secondary" className="text-xs">
                  {amenity.label}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}