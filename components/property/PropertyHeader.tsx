import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Bed, Bath, Square, Car, Info, LandPlot } from 'lucide-react';

interface PropertyHeaderProps {
  property: any;
  formatPrice: (price: number) => string;
}

export const PropertyHeader = ({ property, formatPrice }: PropertyHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold mb-2">{property.title}</h1>
      
      <div className="flex items-center text-[12px] text-gray-600 mb-4">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{property.address}, {property.city}</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-primary mr-2">
            {formatPrice(property.priceRangeStart)} - {formatPrice(property.priceRangeEnd)}
          </h2>
          {property.pricePerSqFt && (
            <span className="text-sm text-gray-500">
              ({formatPrice(property.pricePerSqFt)}/sq.ft)
            </span>
          )}
        </div>
        
        {property.reraApproved && (
          <Dialog>
            <DialogTrigger asChild>
              <Badge variant="outline" className="flex items-center cursor-pointer border-green-500 text-green-600 hover:bg-green-50">
                <Info className="w-3 h-3 mr-1" />
                RERA Approved
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">RERA Details</h3>
                <p className="text-sm mb-4">This property is approved by the Real Estate Regulatory Authority.</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">RERA Number:</div>
                    <div className="font-medium">{property.reraNumber || 'RERA123456789'}</div>
                    <div className="text-gray-600">Valid Until:</div>
                    <div className="font-medium">{property.reraValidUntil || '31 Dec 2025'}</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2 border border-gray-300 rounded-md">
        <div className="flex flex-col items-center justify-center p-4 ">
          <div className="flex items-center mb-2 bg-white/50 p-2 rounded-lg">
            <Bed className="w-4 h-4 mr-1" />
            <span className="font-bold text-base">{property.bedrooms}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Bedrooms</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 ">
          <div className="flex items-center mb-2 bg-white/50 p-2 rounded-lg">
            <Bath className="w-4 h-4 mr-1" />
            <span className="font-bold text-base">{property.bathrooms}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Bathrooms</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 ">
          <div className="flex items-center mb-2 bg-white/50 p-2 rounded-lg">
            <Square className="w-4 h-4 mr-1" />
            <span className="font-bold text-base">{property.area}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Sq.Ft</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 ">
          <div className="flex items-center mb-2 bg-white/50 p-2 rounded-lg">
            <Car className="w-4 h-4 mr-1" />
            <span className="font-bold text-lg">{property.parkingSpot || 1}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Parking</span>
        </div>
        
        {/* <div className="flex flex-col items-center justify-center p-4 ">
          <div className="flex items-center mb-2 bg-white/50 p-2 rounded-lg">
            <Info className="w-4 h-4 mr-1" />
            <span className="font-bold text-xs">{property.constructionStatus}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Status</span>
        </div> */}

        <div className="flex flex-col items-center justify-center p-4 ">
          <div className="flex items-center mb-2 bg-white/50 p-2 rounded-lg">
            <LandPlot className="w-4 h-4 mr-1" />
            <span className="font-bold text-lg">{property?.totalArea}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">{property?.areaUnit}</span>
        </div>
      </div>
    </div>
  );
};