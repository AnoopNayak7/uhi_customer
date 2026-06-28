export type GeoPoint = {
  lat: number;
  lng: number;
};

export type LocationAreaMode = "circle" | "freehand";

export type MapInteractionTool = "pan" | "draw";

export const DEFAULT_MAP_CENTER: GeoPoint = {
  lat: 12.9716,
  lng: 77.5946,
};

export const cityMapCenters: Record<string, GeoPoint> = {
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
};

export function getMapCenterForCity(city?: string): GeoPoint {
  if (!city) return DEFAULT_MAP_CENTER;
  return cityMapCenters[city] ?? DEFAULT_MAP_CENTER;
}
