"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Building2, Star, Award, Users, Calendar, MapPin } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  logoUrl?: string;
  yearEstablished?: number;
  operatingCities?: string[];
  description?: string;
}

interface BuilderInfoProps {
  property: any;
}

export const BuilderInfo = ({ property }: BuilderInfoProps) => {
  // Safely extract developer data
  const developer = property?.developer;
  
  // If no developer data, don't render the component at all
  if (!developer || typeof developer !== 'object') {
    return null;
  }

  // Validate that developer has required fields
  if (!developer.name || !developer.id) {
    return null;
  }

  // Calculate years of experience
  const getYearsOfExperience = () => {
    if (!developer?.yearEstablished || typeof developer.yearEstablished !== 'number') {
      return 'N/A';
    }
    const currentYear = new Date().getFullYear();
    const years = currentYear - developer.yearEstablished;
    return `${years}+ years`;
  };

  // Get operating cities count
  const getOperatingCitiesCount = () => {
    if (!developer?.operatingCities || !Array.isArray(developer.operatingCities) || developer.operatingCities.length === 0) {
      return 'N/A';
    }
    return `${developer.operatingCities.length}+ cities`;
  };

  // Safely get operating cities display
  const getOperatingCitiesDisplay = () => {
    if (!developer?.operatingCities || !Array.isArray(developer.operatingCities) || developer.operatingCities.length === 0) {
      return null;
    }
    
    // Filter out any non-string values
    const validCities = developer.operatingCities.filter((city: any) => typeof city === 'string');
    if (validCities.length === 0) {
      return null;
    }

    const cities = validCities.slice(0, 2);
    const remainingCount = validCities.length - 2;
    
    return (
      <div className="flex items-center text-xs text-gray-500">
        <MapPin className="w-3 h-3 mr-1" />
        <span>
          {cities.join(', ')}
          {remainingCount > 0 && ` +${remainingCount} more`}
        </span>
      </div>
    );
  };

  // Safely get description
  const getDescription = () => {
    if (!developer?.description || typeof developer.description !== 'string') {
      return null;
    }
    
    const maxLength = 120;
    if (developer.description.length <= maxLength) {
      return developer.description;
    }
    
    return `${developer.description.substring(0, maxLength)}...`;
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center mb-4">
          <Building2 className="w-5 h-5 mr-2 text-primary" />
          <h3 className="text-base font-semibold">Builder Information</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            {developer.logoUrl && typeof developer.logoUrl === 'string' ? (
              <img 
                src={developer.logoUrl} 
                alt={`${developer.name} logo`}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-gray-200">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900">{developer.name}</h4>
              {getOperatingCitiesDisplay()}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs text-gray-500">Experience</h4>
              <p className="text-sm font-medium">{getYearsOfExperience()}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs text-gray-500">Operating Cities</h4>
              <p className="text-sm font-medium">{getOperatingCitiesCount()}</p>
            </div>
          </div>
        </div>

        {getDescription() && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              {getDescription()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
