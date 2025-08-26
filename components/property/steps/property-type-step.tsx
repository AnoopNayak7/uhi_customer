"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyFormData } from '../property-wizard';
import { PROPERTY_CATEGORIES } from '@/lib/config';
import { Home, Building, TreePine, Briefcase, Store } from 'lucide-react';

interface PropertyTypeStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

const propertyTypes = [
  {
    value: 'sell',
    label: 'For Sale',
    description: 'List your property for sale',
    icon: Home,
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    value: 'rent',
    label: 'For Rent',
    description: 'List your property for rent',
    icon: Building,
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  }
];

const categoryIcons: Record<string, any> = {
  flat: Building,
  house: Home,
  villa: Home,
  plot: TreePine,
  office: Briefcase,
  shop: Store
};

export function PropertyTypeStep({ formData, updateFormData }: PropertyTypeStepProps) {
  return (
    <div className="space-y-8">
      {/* Property Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What type of listing is this?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propertyTypes.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                formData.propertyType === type.value
                  ? 'ring-2 ring-red-500 border-red-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateFormData({ propertyType: type.value as 'sell' | 'rent' })}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color}`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  {formData.propertyType === type.value && (
                    <Badge className="bg-red-500">Selected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Property Category Selection */}
      {formData.propertyType && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What type of property is this?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PROPERTY_CATEGORIES.map((category) => {
              const IconComponent = categoryIcons[category.value] || Building;
              return (
                <Card
                  key={category.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.category === category.value
                      ? 'ring-2 ring-red-500 border-red-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData({ category: category.value })}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{category.label}</h4>
                    {formData.category === category.value && (
                      // @ts-ignore
                      <Badge size="sm" className="bg-red-500">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {formData.propertyType && formData.category && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Selection Summary</h4>
          <div className="flex items-center space-x-4 text-sm">
            <Badge variant="outline">
              {propertyTypes.find(t => t.value === formData.propertyType)?.label}
            </Badge>
            <Badge variant="outline">
              {PROPERTY_CATEGORIES.find(c => c.value === formData.category)?.label}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}