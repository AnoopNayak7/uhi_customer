"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyFormData } from '../property-wizard';
import { CITIES } from '@/lib/config';

interface LocationStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

const states = [
  'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 
  'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Haryana'
];

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Location
        </h3>
        <p className="text-gray-600 mb-6">
          Provide the complete address of your property.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="address">Complete Address *</Label>
          <Input
            id="address"
            placeholder="e.g., 123 Main Street, Sector 5, Near Metro Station"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Select value={formData.city} onValueChange={(value) => updateFormData({ city: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={formData.state} onValueChange={(value) => updateFormData({ state: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="zipCode">Pincode *</Label>
          <Input
            id="zipCode"
            placeholder="e.g., 560001"
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
            className="mt-1"
            maxLength={6}
          />
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="mt-1"
            readOnly
          />
        </div>
      </div>

      {/* Location Preview */}
      {formData.address && formData.city && formData.state && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Address Preview</h4>
          <p className="text-gray-700">
            {formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}
          </p>
        </div>
      )}
    </div>
  );
}