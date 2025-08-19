import { Card, CardContent } from '@/components/ui/card';
import { Car, Shield, Dumbbell, Trees, Waves, Users, Zap, Building, Wifi, ShieldCheck, Cctv, Footprints, CloudHail, Bike, Theater, Landmark, Gamepad, FireExtinguisher, Wand2, Trophy, Library } from 'lucide-react';

const amenityIcons: { [key: string]: any } = {
  'Parking': Car,
  'Car Parking': Car,
  'Security': Shield,
  'Gym': Dumbbell,
  'Gymnasium': Dumbbell,
  'Jogging Track': Footprints,
  'Garden': Trees,
  'Swimming Pool': Waves,
  'Clubhouse': Users,
  'Power Backup': Zap,
  'Lift': Building,
  'WiFi': Wifi,
  'CCTV': ShieldCheck,
  'CCTV Surveillance': Cctv,
  'Rainwater Harvesting': CloudHail,
  'Cycling Path': Bike,
  'Mini Theater': Theater,
  'Multipurpose Hall': Landmark,
  'Party Hall': Landmark,
  'Indoor Games Room': Gamepad,
  'Fire Safety Systems': FireExtinguisher,
  'Spa/Sauna': Wand2,
  'Outdoor Sports Courts': Trophy,
  'Library/Business Center': Library,
  'Landscaped Gardens': Trees
};

interface PropertyAmenitiesProps {
  amenities: string[];
}

export const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <h3 className="text-base font-semibold mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity] || Shield;
            return (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{amenity}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};