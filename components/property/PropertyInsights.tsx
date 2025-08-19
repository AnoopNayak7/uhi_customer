import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Users, ShieldCheck } from 'lucide-react';

interface PropertyInsightsProps {
  property: any;
}

export const PropertyInsights = ({ property }: PropertyInsightsProps) => {
  // Mock data for insights
  const listedDays = property.listedDays || 30;
  const viewCount = property.viewCount || 245;
  const interestedCount = property.interestedCount || 18;
  const isVerified = property.isVerified !== undefined ? property.isVerified : true;
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <h3 className="text-base font-semibold mb-4">Property Insights</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600 mb-1" />
            <div className="font-medium text-sm">{listedDays} days</div>
            <div className="text-xs text-gray-500">Listed</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <Eye className="w-5 h-5 text-gray-600 mb-1" />
            <div className="font-medium text-sm">{viewCount}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-600 mb-1" />
            <div className="font-medium text-sm">{interestedCount}</div>
            <div className="text-xs text-gray-500">Interested</div>
          </div>
        </div>
        
        {isVerified && (
          <div className="flex items-center justify-center bg-green-50 p-3 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-green-700 font-medium">Verified Property</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};