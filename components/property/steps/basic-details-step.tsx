"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PropertyFormData } from '../property-wizard';

interface BasicDetailsStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

export function BasicDetailsStep({ formData, updateFormData }: BasicDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Property Information
        </h3>
        <p className="text-gray-600 mb-6">
          Provide a compelling title and description for your property listing.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Property Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Luxury 3BHK Apartment in Whitefield"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Create an attractive title that highlights key features
          </p>
        </div>

        <div>
          <Label htmlFor="description">Property Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your property in detail. Include key features, nearby amenities, and what makes it special..."
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={6}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum 50 characters. Be descriptive and highlight unique selling points.
          </p>
        </div>
      </div>

      {/* Character count */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Description length:</span>
          <span className={`font-medium ${
            formData.description.length >= 50 ? 'text-green-600' : 'text-red-500'
          }`}>
            {formData.description.length} characters
            {formData.description.length < 50 && ` (${50 - formData.description.length} more needed)`}
          </span>
        </div>
      </div>
    </div>
  );
}