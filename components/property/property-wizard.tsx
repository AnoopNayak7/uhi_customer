"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PropertyTypeStep } from './steps/property-type-step';
import { BasicDetailsStep } from './steps/basic-details-step';
import { LocationStep } from './steps/location-step';
import { PropertyDetailsStep } from './steps/property-details-step';
import { AmenitiesStep } from './steps/amenities-step';
import { ImagesStep } from './steps/images-step';
import { PricingStep } from './steps/pricing-step';
import { ReviewStep } from './steps/review-step';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

export interface PropertyFormData {
  // Step 1: Property Type
  propertyType: 'sell' | 'rent';
  category: string;
  
  // Step 2: Basic Details
  title: string;
  description: string;
  
  // Step 3: Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  
  // Step 4: Property Details
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm' | 'acres';
  constructionStatus: string;
  furnishingStatus: string;
  totalFloors?: number;
  floorNumber?: number;
  facing?: string;
  
  // Step 5: Amenities
  features: string[];
  
  // Step 6: Images (now stores File objects temporarily)
  images: string[];
  imageFiles: File[];
  
  // Step 7: Pricing
  price: number;
  maintenanceCharges?: number;
  securityDeposit?: number;
  
  // Additional fields
  possessionDate?: string;
  ownershipType?: string;
}

const steps = [
  { id: 1, title: 'Property Type', description: 'Choose property type and category' },
  { id: 2, title: 'Basic Details', description: 'Property title and description' },
  { id: 3, title: 'Location', description: 'Property address and location' },
  { id: 4, title: 'Property Details', description: 'Bedrooms, bathrooms, area etc.' },
  { id: 5, title: 'Amenities', description: 'Features and amenities' },
  { id: 6, title: 'Images', description: 'Upload property photos' },
  { id: 7, title: 'Pricing', description: 'Set price and charges' },
  { id: 8, title: 'Review', description: 'Review and submit' },
];

export function PropertyWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyType: 'sell',
    category: '',
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    areaUnit: 'sqft',
    constructionStatus: '',
    furnishingStatus: '',
    features: [],
    images: [],
    imageFiles: [],
    price: 0,
  });

  const updateFormData = (data: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Step 1: Create property without images - map to API format
      const propertyData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        price: formData.price,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        areaUnit: formData.areaUnit,
        features: formData.features,
        category: formData.category,
        constructionStatus: formData.constructionStatus,
        furnishingStatus: formData.furnishingStatus,
        possessionDate: formData.possessionDate,
        ...(formData.totalFloors && { totalFloors: formData.totalFloors }),
        ...(formData.floorNumber && { floorNumber: formData.floorNumber }),
        ...(formData.facing && { facing: formData.facing }),
        ...(formData.maintenanceCharges && { maintenanceCharges: formData.maintenanceCharges }),
        ...(formData.securityDeposit && { securityDeposit: formData.securityDeposit }),
        ...(formData.ownershipType && { ownershipType: formData.ownershipType })
      };

      const response:any = await apiClient.createProperty(propertyData);
      
      if (response.success && response.data) {
        const propertyId = response.data.id;
        setCreatedPropertyId(propertyId);
        
        // Step 2: Upload images if any
        if (formData.imageFiles && formData.imageFiles.length > 0) {
          try {
            await apiClient.uploadPropertyImages(propertyId, formData.imageFiles);
            toast.success('Property created and images uploaded successfully!');
          } catch (imageError) {
            console.error('Error uploading images:', imageError);
            toast.warning('Property created but some images failed to upload. You can add them later.');
          }
        } else {
          toast.success('Property created successfully!');
        }
        
        router.push('/dashboard/properties');
      } else {
        throw new Error('Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PropertyTypeStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BasicDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <LocationStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PropertyDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <AmenitiesStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ImagesStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <PricingStep formData={formData} updateFormData={updateFormData} />;
      case 8:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyType && formData.category;
      case 2:
        return formData.title && formData.description;
      case 3:
        return formData.address && formData.city && formData.state && formData.zipCode;
      case 4:
        return formData.bedrooms > 0 && formData.bathrooms > 0 && formData.area > 0 && formData.constructionStatus && formData.furnishingStatus;
      case 5:
        return true; // Amenities are optional
      case 6:
        return true; // Images are optional but recommended
      case 7:
        return formData.price > 0;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-xl">
                Step {currentStep} of {steps.length}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="hidden lg:block mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep > step.id 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.id
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || loading}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-4">
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid() || loading}
              className="bg-red-500 hover:bg-red-600"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Property...
                </>
              ) : (
                'Create Property'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}