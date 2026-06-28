import { CalendarCheck, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { HomeSection } from "@/components/home/home-section";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: "300+",
    label: "Site visits completed",
    icon: MapPin,
  },
  {
    value: "5★",
    label: "Rated",
    icon: Star,
    showStars: true,
  },
  {
    value: "Free",
    label: "Site visit booking",
    icon: CalendarCheck,
  },
  {
    value: "100+",
    label: "Happy home buyers",
    icon: Users,
  },
  {
    value: "100%",
    label: "RERA verified",
    icon: ShieldCheck,
  },
] as const;

export function TrustStatsSection() {
  return (
    <HomeSection className="py-8 sm:py-10">
      <div className="property-surface overflow-hidden">
        <div className="grid grid-cols-2 bg-[#EBEBEB] gap-px sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isLastOnMobile = index === stats.length - 1;

            return (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 bg-white px-3 py-5 text-center sm:gap-2.5 sm:px-4 sm:py-7",
                  isLastOnMobile && "col-span-2 sm:col-span-1"
                )}
              >
                <span className="property-icon-pill size-8 sm:size-9">
                  <Icon className="size-3.5 sm:size-4" strokeWidth={1.5} />
                </span>

                {"showStars" in stat && stat.showStars ? (
                  <>
                    <div
                      className="hidden items-center justify-center gap-0.5 sm:flex"
                      aria-label="5 star rated"
                    >
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="size-3.5 fill-[#303030] text-[#303030] lg:size-4"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <div className="font-playfair text-xl font-bold leading-none tracking-[-0.02em] text-[#1A1A1A] sm:hidden">
                      5★
                    </div>
                  </>
                ) : (
                  <div className="font-playfair text-xl font-bold leading-none tracking-[-0.02em] text-[#1A1A1A] sm:text-2xl lg:text-3xl">
                    {"value" in stat ? stat.value : null}
                  </div>
                )}

                <p className="max-w-[9rem] font-manrope text-[11px] leading-snug text-[#717171] sm:max-w-none sm:text-sm">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </HomeSection>
  );
}
