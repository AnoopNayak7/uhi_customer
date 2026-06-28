import { MapPin, ShieldCheck } from "lucide-react";
import PropertyDetailsGrid from "./PropertyDetailsGrid";
import { ReraDetailsDialog } from "./ReraDetailsDialog";

interface PropertyHeaderProps {
  property: any;
  formatPrice: (price: number) => string;
}

export const PropertyHeader = ({
  property,
  formatPrice,
}: PropertyHeaderProps) => {
  const listingLabel =
    property.propertyType === "rent"
      ? "For rent"
      : property.propertyType === "commercial"
        ? "Commercial"
        : "For sale";

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <span className="property-badge-listing uppercase tracking-[0.08em]">
          {property.category || "Property"} · {listingLabel}
        </span>

        <h1 className="font-manrope text-xl font-semibold tracking-[-0.02em] text-[#1A1A1A] sm:text-2xl">
          {property.title}
        </h1>

        <div className="flex items-center font-manrope text-sm text-[#5C5C5C]">
          <MapPin className="mr-1.5 size-4 shrink-0" strokeWidth={1.5} />
          <span>
            {property.address}, {property.city}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="font-manrope text-[1.65rem] font-bold tracking-[-0.03em] text-[#1A1A1A] sm:text-[2rem]">
            {formatPrice(property.priceRangeStart)} –{" "}
            {formatPrice(property.priceRangeEnd)}
          </p>
          {property.pricePerSqFt ? (
            <span className="font-manrope text-sm text-[#5C5C5C]">
              ({formatPrice(property.pricePerSqFt)}/sq.ft)
            </span>
          ) : null}
        </div>

        {(property.reraApproved ||
          property.rera?.registrationNumber ||
          property.reraNumber) ? (
          <ReraDetailsDialog
            property={property}
            trigger={
              <button
                type="button"
                className="property-badge-rera cursor-pointer uppercase tracking-[0.08em]"
              >
                <ShieldCheck className="size-3 shrink-0" strokeWidth={2} />
                RERA verified
              </button>
            }
          />
        ) : null}
      </div>

      <PropertyDetailsGrid property={property} />
    </div>
  );
};
