import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Home } from "lucide-react";

interface PropertyDetailsProps {
  property: any;
}

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const items = [
    {
      icon: Home,
      label: "Furnishing status",
      value: property.furnishingStatus || "Unfurnished",
    },
    {
      icon: Calendar,
      label: "Possession date",
      value:
        (typeof property.possessionDate === "string" &&
          property.possessionDate) ||
        "Ready to move",
    },
    {
      icon: Building2,
      label: "Developer",
      value: property.developer?.name || "Urban House Infra",
    },
  ];

  return (
    <Card className="property-surface">
      <CardContent className="relative p-5 sm:p-6">
        <p className="property-section-eyebrow">Specifications</p>
        <h3 className="property-section-title mb-5">details</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-[16px] border border-[#F0F0F0] bg-[#FAFAFA] p-4"
            >
              <div className="property-icon-pill">
                <item.icon className="size-4" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="home-card-label">{item.label}</h4>
                <p className="mt-1 font-manrope text-sm font-medium text-[#1A1A1A]">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
