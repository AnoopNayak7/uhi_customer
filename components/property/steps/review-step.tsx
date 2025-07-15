"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyFormData } from '../property-wizard';
import { PROPERTY_CATEGORIES } from '@/lib/config';
import { 
  MapPin, 
  Home, 
  IndianRupee, 
  Calendar, 
  Image as ImageIcon,
  Bed,
  Bath,
  Square,
  Building
} from 'lucide-react';
import Image from 'next/image';

interface ReviewStepProps {
  formData: PropertyFormData;
}

export function ReviewStep({ formData }: any) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getCategoryLabel = (value: string) => {
    return PROPERTY_CATEGORIES.find(cat => cat.value === value)?.label || value;
  };

  const getStatusLabel = (value: string) => {
    const statusMap: Record<string, string> = {
      'new': 'New',
      'resale': 'Resale',
      'under_construction': 'Under Construction',
      'unfurnished': 'Unfurnished',
      'semi_furnished': 'Semi Furnished',
      'fully_furnished': 'Fully Furnished'
    };
    return statusMap[value] || value;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review Your Property Listing
        </h3>
        <p className="text-gray-600 mb-6">
          Please review all the information before submitting your property listing.
        </p>
      </div>

      {/* Property Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>Property Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-xl text-gray-900">{formData.title}</h4>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={formData.propertyType === 'sell' ? 'bg-green-500' : 'bg-blue-500'}>
                For {formData.propertyType === 'sell' ? 'Sale' : 'Rent'}
              </Badge>
              <Badge variant="outline">
                {getCategoryLabel(formData.category)}
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-600">{formData.description}</p>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900">
            {formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}
          </p>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Property Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Bed className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <div className="font-semibold">{formData.bedrooms}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Bath className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <div className="font-semibold">{formData.bathrooms}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Square className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <div className="font-semibold">{formData.area}</div>
              <div className="text-sm text-gray-600">{formData.areaUnit}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <div className="font-semibold">{formData.floorNumber || 'N/A'}</div>
              <div className="text-sm text-gray-600">Floor</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Construction Status:</span>
              <span className="ml-2 font-medium">{getStatusLabel(formData.constructionStatus)}</span>
            </div>
            <div>
              <span className="text-gray-600">Furnishing:</span>
              <span className="ml-2 font-medium">{getStatusLabel(formData.furnishingStatus)}</span>
            </div>
            {formData.facing && (
              <div>
                <span className="text-gray-600">Facing:</span>
                <span className="ml-2 font-medium capitalize">{formData.facing}</span>
              </div>
            )}
            {formData.totalFloors && (
              <div>
                <span className="text-gray-600">Total Floors:</span>
                <span className="ml-2 font-medium">{formData.totalFloors}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      {formData.features && formData.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature:any) => (
                <Badge key={feature} variant="secondary">
                  {feature.replace(/_/g, ' ').replace(/\b\w/g, (l:any) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Property Images ({formData.images?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.images && formData.images.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {formData.images.map((image:any, index:any) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No images uploaded</p>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IndianRupee className="w-5 h-5" />
            <span>Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {formData.propertyType === 'sell' ? 'Sale Price' : 'Monthly Rent'}
              </span>
              <span className="font-semibold text-xl text-red-600">
                {formatPrice(formData.price)}
              </span>
            </div>

            {formData.propertyType === 'rent' && (
              <>
                {formData.securityDeposit && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-medium">{formatPrice(formData.securityDeposit)}</span>
                  </div>
                )}
                {formData.maintenanceCharges && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Maintenance</span>
                    <span className="font-medium">₹{formData.maintenanceCharges.toLocaleString()}</span>
                  </div>
                )}
              </>
            )}

            {formData.availableFrom && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Possession Date</span>
                <span className="font-medium">
                  {new Date(formData.possessionDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}