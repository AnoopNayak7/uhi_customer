"use client";

interface PropertyDetailsGridProps {
  property: {
    bedrooms?: number;
    bhkConfigurations?: string[];
    bhkVariants?: string[];
    specifications?: Array<{ name?: string; value?: string }>;
    area?: number | string;
    builtUpAreaRangeStart?: number;
    builtUpAreaRangeEnd?: number;
    parkingSpot?: number;
    totalArea?: number | string;
    totalAreaUnit?: string;
    areaUnit?: string;
    category?: string;
    towerCount?: number;
    towersAndBlocks?: string;
  };
}

function normalizeAreaUnit(unit?: string) {
  if (!unit || unit === "sq ft") return "sqft";
  return unit;
}

function isAcreUnit(unit?: string) {
  const normalized = (unit || "").toLowerCase();
  return normalized === "acre" || normalized === "acres";
}

function normalizeConfigurationLabel(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/studio/i.test(trimmed)) return "Studio";
  if (/penthouse/i.test(trimmed)) return "Penthouse";

  const match = trimmed.match(/(\d+)\s*bhk/i);
  if (match) return `${match[1]} BHK`;

  return trimmed;
}

function configurationSortOrder(label: string) {
  if (/studio/i.test(label)) return 0;
  if (/penthouse/i.test(label)) return 100;
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : 50;
}

function getAvailableConfigurations(
  property: PropertyDetailsGridProps["property"]
) {
  const configs = new Set<string>();

  property.bhkConfigurations?.forEach((item) => {
    const normalized = normalizeConfigurationLabel(item);
    if (normalized) configs.add(normalized);
  });

  property.bhkVariants?.forEach((item) => {
    const normalized = normalizeConfigurationLabel(item);
    if (normalized) configs.add(normalized);
  });

  property.specifications?.forEach((spec) => {
    if (spec?.name?.toLowerCase() !== "configurations" || !spec.value) return;
    spec.value
      .split(",")
      .map((part) => normalizeConfigurationLabel(part))
      .filter(Boolean)
      .forEach((part) => configs.add(part));
  });

  if (!configs.size && property.bedrooms && property.bedrooms > 0) {
    configs.add(`${property.bedrooms} BHK`);
  }

  return Array.from(configs).sort(
    (a, b) => configurationSortOrder(a) - configurationSortOrder(b)
  );
}

function formatTower(property: PropertyDetailsGridProps["property"]) {
  if (property.towerCount != null && property.towerCount > 0) {
    return property.towerCount === 1
      ? "1 Tower"
      : `${property.towerCount} Towers`;
  }

  if (property.towersAndBlocks?.trim()) {
    return property.towersAndBlocks.trim();
  }

  return "—";
}

function formatBuiltUpRange(property: PropertyDetailsGridProps["property"]) {
  const unit = normalizeAreaUnit(property.areaUnit || "sqft");
  const start =
    property.builtUpAreaRangeStart ?? (Number(property.area) || undefined);
  let end = property.builtUpAreaRangeEnd;

  if (
    end == null &&
    property.totalArea != null &&
    !isAcreUnit(property.totalAreaUnit)
  ) {
    end = Number(property.totalArea);
  }

  if (!start) return "—";

  const range = end && end !== start ? `${start}–${end}` : String(start);

  return `${range} ${unit}`;
}

function formatPlotArea(property: PropertyDetailsGridProps["property"]) {
  const unit = normalizeAreaUnit(property.areaUnit || "sqft");
  const value = property.area ?? property.builtUpAreaRangeStart;
  if (value == null || value === "") return "—";

  return `${value} ${unit}`;
}

function DetailSection({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-5 py-4">
      <p className="property-stat-label">{label}</p>
      <p className="property-stat-value mt-1.5">{value}</p>
    </div>
  );
}

const PropertyDetailsGrid = ({ property }: PropertyDetailsGridProps) => {
  const isPlot = property.category?.toLowerCase() === "plot";
  const configurations = getAvailableConfigurations(property);
  const configurationText = configurations.length
    ? configurations.join(", ")
    : "—";
  const towerText = formatTower(property);
  const rangeText = isPlot
    ? formatPlotArea(property)
    : formatBuiltUpRange(property);
  const parkingCount = property.parkingSpot || 1;
  const parkingText = `${parkingCount} Parking`;

  return (
    <div className="property-surface overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-y divide-[#EBEBEB] lg:grid-cols-4 lg:divide-y-0">
        <DetailSection label="Configurations" value={configurationText} />
        <DetailSection label="Tower" value={towerText} />
        <DetailSection
          label={isPlot ? "Plot area" : "Built-up area"}
          value={rangeText}
        />
        <DetailSection label="Parking" value={parkingText} />
      </div>
    </div>
  );
};

export default PropertyDetailsGrid;
