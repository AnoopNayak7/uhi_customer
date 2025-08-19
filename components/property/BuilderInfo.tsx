import { Card, CardContent } from '@/components/ui/card';
import { Building2, Star, Award, Users } from 'lucide-react';

interface BuilderInfoProps {
  property: any;
}

export const BuilderInfo = ({ property }: BuilderInfoProps) => {
  const developer = property.developer || 'Urban House Infra';
  const developerRating = property.developerRating || 4.5;
  const developerExperience = property.developerExperience || '15+ years';
  const developerProjects = property.developerProjects || '25+ completed';
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center mb-4">
          <Building2 className="w-5 h-5 mr-2 text-primary" />
          <h3 className="text-base font-semibold">Builder Information</h3>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-1">{developer}</h4>
          <div className="flex items-center">
            <div className="flex items-center bg-green-50 text-green-700 rounded px-2 py-0.5 text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              <span>{developerRating}/5</span>
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
              <p className="text-sm font-medium">{developerExperience}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs text-gray-500">Projects</h4>
              <p className="text-sm font-medium">{developerProjects}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};