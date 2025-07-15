"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyFormData } from '../property-wizard';
import { IndianRupee, Calendar, Shield } from 'lucide-react';

interface PricingStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

export function PricingStep({ formData, updateFormData }: any) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const calculateEMI = (principal: number, rate: number = 9, tenure: number = 20) => {
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                 (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pricing Information
        </h3>
        <p className="text-gray-600 mb-6">
          Set the price and additional charges for your property.
        </p>
      </div>

      {/* Main Price */}
      <div>
        <Label htmlFor="price" className="flex items-center space-x-2">
          <IndianRupee className="w-4 h-4" />
          <span>
            {formData.propertyType === 'sell' ? 'Sale Price' : 'Monthly Rent'} *
          </span>
        </Label>
        <Input
          id="price"
          type="number"
          placeholder={formData.propertyType === 'sell' ? 'e.g., 5000000' : 'e.g., 25000'}
          value={formData.price || ''}
          onChange={(e) => updateFormData({ price: parseInt(e.target.value) || 0 })}
          className="mt-1 text-lg"
        />
        {formData.price > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {formatPrice(formData.price)}
          </p>
        )}
      </div>

      {/* Additional Charges for Rent */}
      {formData.propertyType === 'rent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="securityDeposit" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security Deposit</span>
            </Label>
            <Input
              id="securityDeposit"
              type="number"
              placeholder="e.g., 50000"
              value={formData.securityDeposit || ''}
              onChange={(e) => updateFormData({ securityDeposit: parseInt(e.target.value) || undefined })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="maintenanceCharges">Monthly Maintenance</Label>
            <Input
              id="maintenanceCharges"
              type="number"
              placeholder="e.g., 2000"
              value={formData.maintenanceCharges || ''}
              onChange={(e) => updateFormData({ maintenanceCharges: parseInt(e.target.value) || undefined })}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Available From */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="possessionDate" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Possession Date</span>
          </Label>
          <Input
            id="possessionDate"
            type="date"
            value={formData.possessionDate || ''}
            onChange={(e) => updateFormData({ possessionDate: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="ownershipType">Ownership Type</Label>
          <Select value={formData.ownershipType || ''} onValueChange={(value) => updateFormData({ ownershipType: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select ownership type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freehold">Freehold</SelectItem>
              <SelectItem value="leasehold">Leasehold</SelectItem>
              <SelectItem value="cooperative">Cooperative Society</SelectItem>
              <SelectItem value="power_of_attorney">Power of Attorney</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Summary Card */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Price Summary</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {formData.propertyType === 'sell' ? 'Sale Price' : 'Monthly Rent'}
              </span>
              <span className="font-semibold text-lg">
                {formData.price > 0 ? formatPrice(formData.price) : '₹0'}
              </span>
            </div>

            {formData.propertyType === 'rent' && (
              <>
                {formData.securityDeposit && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-medium">
                      {formatPrice(formData.securityDeposit)}
                    </span>
                  </div>
                )}
                
                {formData.maintenanceCharges && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Maintenance</span>
                    <span className="font-medium">
                      ₹{formData.maintenanceCharges.toLocaleString()}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* EMI Calculator for Sale Properties */}
          {formData.propertyType === 'sell' && formData.price > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-3">EMI Calculator</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Loan Amount (80%)</span>
                  <div className="font-medium">
                    {formatPrice(formData.price * 0.8)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">EMI @ 9% (20 years)</span>
                <span className="text-gray-600">Possession Date</span>
                    ₹{calculateEMI(formData.price * 0.8).toLocaleString()}/month
                  {new Date(formData.possessionDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}