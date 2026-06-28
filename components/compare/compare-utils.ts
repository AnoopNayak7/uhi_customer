export function formatPrice(price: number) {
  if (!price) return "N/A";
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export function getComparisonScore(property: {
  price?: number;
  area?: number;
  bedrooms?: number;
  features?: string[];
}) {
  const price = property.price || 0;
  const area = property.area || 1;
  const pricePerSqft = price / area;
  const amenityScore = (property.features?.length || 0) * 10;
  const bedroomScore = (property.bedrooms || 0) * 20;
  return Math.min(
    100,
    Math.max(0, 100 - pricePerSqft / 1000 + amenityScore + bedroomScore)
  );
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
