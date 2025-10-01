import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Home, Building2 } from 'lucide-react';

interface PropertyDetailsProps {
  property: any;
}

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <h3 className="text-base font-semibold mb-4">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Furnishing Status</h4>
              <p className="text-sm text-gray-600">{property.furnishingStatus || 'Unfurnished'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Possession Date</h4>
              <p className="text-sm text-gray-600">{(typeof property.possessionDate === 'string' && property.possessionDate) || 'Ready to Move'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Developer</h4>
              <p className="text-sm text-gray-600">
                {property.developer?.name || 'Urban House Infra'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};