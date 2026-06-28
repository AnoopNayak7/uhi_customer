import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, ShieldCheck } from "lucide-react";

interface PropertyInsightsProps {
  property: any;
}

export const PropertyInsights = ({ property }: PropertyInsightsProps) => {
  const listedDays = property.createdAt
    ? Math.floor(
        (Date.now() - new Date(property.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const viewCount = property.viewsCount || 0;
  const isVerified = property.status === "approved";

  return (
    <Card className="property-surface">
      <CardContent className="p-5 sm:p-6">
        <p className="property-section-eyebrow">Market</p>
        <h3 className="property-section-title mb-5">property insights</h3>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#EBEBEB] bg-[#FAFAFA] p-4">
            <Clock className="mb-2 size-4 text-[#5C5C5C]" strokeWidth={1.5} />
            <div className="font-manrope text-sm font-semibold text-[#1A1A1A]">
              {listedDays} days
            </div>
            <div className="home-card-label mt-1">Listed</div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#EBEBEB] bg-[#FAFAFA] p-4">
            <Eye className="mb-2 size-4 text-[#5C5C5C]" strokeWidth={1.5} />
            <div className="font-manrope text-sm font-semibold text-[#1A1A1A]">
              {viewCount}
            </div>
            <div className="home-card-label mt-1">Views</div>
          </div>
        </div>

        {isVerified ? (
          <div className="flex items-center justify-center rounded-[16px] border border-[#EBEBEB] bg-[#FAFAFA] p-3">
            <ShieldCheck
              className="mr-2 size-4 text-[#303030]"
              strokeWidth={1.5}
            />
            <span className="font-manrope text-sm font-medium text-[#3A3A3A]">
              Verified property
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
