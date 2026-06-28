import type { ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bike,
  Building,
  Car,
  Cctv,
  CloudHail,
  Dumbbell,
  FireExtinguisher,
  Footprints,
  Gamepad,
  Landmark,
  Library,
  Shield,
  ShieldCheck,
  Theater,
  Trees,
  Trophy,
  Users,
  Waves,
  Wand2,
  Wifi,
  Zap,
} from "lucide-react";

const amenityIcons: { [key: string]: ComponentType<{ className?: string }> } = {
  Parking: Car,
  "Car Parking": Car,
  Security: Shield,
  Gym: Dumbbell,
  Gymnasium: Dumbbell,
  "Jogging Track": Footprints,
  Garden: Trees,
  "Swimming Pool": Waves,
  Clubhouse: Users,
  "Power Backup": Zap,
  Lift: Building,
  WiFi: Wifi,
  CCTV: ShieldCheck,
  "CCTV Surveillance": Cctv,
  "Rainwater Harvesting": CloudHail,
  "Cycling Path": Bike,
  "Mini Theater": Theater,
  "Multipurpose Hall": Landmark,
  "Party Hall": Landmark,
  "Indoor Games Room": Gamepad,
  "Fire Safety Systems": FireExtinguisher,
  "Spa/Sauna": Wand2,
  "Outdoor Sports Courts": Trophy,
  "Library/Business Center": Library,
  "Landscaped Gardens": Trees,
};

interface PropertyAmenitiesProps {
  amenities: string[];
}

export const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <Card className="property-surface">
      <CardContent className="relative p-5 sm:p-6">
        <p className="property-section-eyebrow">Features</p>
        <h3 className="property-section-title mb-5">amenities</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {amenities.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity] || Shield;
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-[14px] border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5"
              >
                <div className="property-icon-pill !size-8">
                  <IconComponent className="size-4" />
                </div>
                <span className="font-manrope text-sm text-[#3A3A3A]">
                  {amenity}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
