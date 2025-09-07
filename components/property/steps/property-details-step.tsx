"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PropertyFormData } from '../property-wizard';
import { Minus, Plus } from 'lucide-react';

interface PropertyDetailsStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

const constructionStatuses = [
  { value: 'new', label: 'New' },
  { value: 'resale', label: 'Resale' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready to Move' }
];

const furnishingStatuses = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi_furnished', label: 'Semi Furnished' },
  { value: 'fully_furnished', label: 'Fully Furnished' }
];

const facingOptions = [
  'North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'
];

export function PropertyDetailsStep({ formData, updateFormData }: PropertyDetailsStepProps) {
  const incrementValue = (field: keyof PropertyFormData, min = 0) => {
    const currentValue = formData[field] as number;
    updateFormData({ [field]: Math.max(min, currentValue + 1) });
  };

  const decrementValue = (field: keyof PropertyFormData, min = 0) => {
    const currentValue = formData[field] as number;
    updateFormData({ [field]: Math.max(min, currentValue - 1) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Specifications
        </h3>
        <p className="text-gray-600 mb-6">
          Provide detailed information about your property.
        </p>
      </div>

      {/* Bedrooms and Bathrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Bedrooms *</Label>
          <div className="flex items-center space-x-3 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => decrementValue('bedrooms', 1)}
              disabled={formData.bedrooms <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium">{formData.bedrooms}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => incrementValue('bedrooms')}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Bathrooms *</Label>
          <div className="flex items-center space-x-3 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => decrementValue('bathrooms', 1)}
              disabled={formData.bathrooms <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium">{formData.bathrooms}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => incrementValue('bathrooms')}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="area">Built-up Area *</Label>
          <Input
            id="area"
            type="number"
            step="0.1"
            placeholder="e.g., 1200.5"
            value={formData.area || ''}
            onChange={(e) => updateFormData({ area: parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="areaUnit">Unit *</Label>
          <Select value={formData.areaUnit} onValueChange={(value) => updateFormData({ areaUnit: value as 'sqft' | 'sqm' | 'acres' })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">Sq. Ft.</SelectItem>
              <SelectItem value="sqm">Sq. Meter</SelectItem>
              <SelectItem value="acres">Acres</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Construction and Furnishing Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="constructionStatus">Construction Status *</Label>
          <Select value={formData.constructionStatus} onValueChange={(value) => updateFormData({ constructionStatus: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {constructionStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="furnishingStatus">Furnishing Status *</Label>
          <Select value={formData.furnishingStatus} onValueChange={(value) => updateFormData({ furnishingStatus: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select furnishing" />
            </SelectTrigger>
            <SelectContent>
              {furnishingStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="totalFloors">Total Floors</Label>
          <Input
            id="totalFloors"
            type="number"
            placeholder="e.g., 10"
            value={formData.totalFloors || ''}
            onChange={(e) => updateFormData({ totalFloors: parseInt(e.target.value) || undefined })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="floorNumber">Floor Number</Label>
          <Input
            id="floorNumber"
            type="number"
            placeholder="e.g., 5"
            value={formData.floorNumber || ''}
            onChange={(e) => updateFormData({ floorNumber: parseInt(e.target.value) || undefined })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="facing">Facing</Label>
          <Select value={formData.facing || ''} onValueChange={(value) => updateFormData({ facing: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select facing" />
            </SelectTrigger>
            <SelectContent>
              {facingOptions.map((facing) => (
                <SelectItem key={facing} value={facing.toLowerCase()}>
                  {facing}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}