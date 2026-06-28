import type { GeoPoint } from "./types";

const METERS_PER_DEG_LAT = 111_320;

export function formatMeters(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function getDiameterMeters(radiusMeters: number) {
  return radiusMeters * 2;
}

export function getAreaSqKm(radiusMeters: number) {
  const areaSqM = Math.PI * radiusMeters * radiusMeters;
  return areaSqM / 1_000_000;
}

export function formatArea(radiusMeters: number) {
  const sqKm = getAreaSqKm(radiusMeters);
  if (sqKm < 0.01) {
    return `${Math.round(sqKm * 1_000_000)} m²`;
  }
  return `${sqKm.toFixed(2)} km²`;
}

export function formatAreaSqMeters(areaSqM: number) {
  if (areaSqM >= 1_000_000) {
    return `${(areaSqM / 1_000_000).toFixed(2)} km²`;
  }
  return `${Math.round(areaSqM)} m²`;
}

export function formatLatLng(point: GeoPoint) {
  return `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
}

export function getPolygonCentroid(points: GeoPoint[]): GeoPoint {
  if (points.length === 0) return { lat: 0, lng: 0 };
  if (points.length === 1) return points[0];

  let sumLat = 0;
  let sumLng = 0;
  for (const point of points) {
    sumLat += point.lat;
    sumLng += point.lng;
  }
  return {
    lat: sumLat / points.length,
    lng: sumLng / points.length,
  };
}

export function getPolygonAreaSqMeters(points: GeoPoint[]): number {
  if (points.length < 3) return 0;

  const centroid = getPolygonCentroid(points);
  const latRad = (centroid.lat * Math.PI) / 180;
  const mPerDegLng = METERS_PER_DEG_LAT * Math.cos(latRad);

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const xi = points[i].lng * mPerDegLng;
    const yi = points[i].lat * METERS_PER_DEG_LAT;
    const xj = points[j].lng * mPerDegLng;
    const yj = points[j].lat * METERS_PER_DEG_LAT;
    area += xi * yj - xj * yi;
  }

  return Math.abs(area / 2);
}

export function equivalentRadiusFromArea(areaSqM: number) {
  return Math.sqrt(areaSqM / Math.PI);
}

export function simplifyPolygonPath(
  points: GeoPoint[],
  minDistanceMeters = 8
): GeoPoint[] {
  if (points.length <= 2) return points;

  const simplified: GeoPoint[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = simplified[simplified.length - 1];
    const next = points[i];
    const latRad = (prev.lat * Math.PI) / 180;
    const dx = (next.lng - prev.lng) * METERS_PER_DEG_LAT * Math.cos(latRad);
    const dy = (next.lat - prev.lat) * METERS_PER_DEG_LAT;
    if (Math.hypot(dx, dy) >= minDistanceMeters) {
      simplified.push(next);
    }
  }

  const first = simplified[0];
  const last = simplified[simplified.length - 1];
  const latRad = (first.lat * Math.PI) / 180;
  const dx = (last.lng - first.lng) * METERS_PER_DEG_LAT * Math.cos(latRad);
  const dy = (last.lat - first.lat) * METERS_PER_DEG_LAT;
  if (Math.hypot(dx, dy) < minDistanceMeters && simplified.length > 1) {
    simplified.pop();
  }

  return simplified;
}
