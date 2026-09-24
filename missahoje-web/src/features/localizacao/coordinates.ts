import type { Coordinates } from './types';

const PRECISION = 1000;

export function truncateCoordinate(value: number): number {
  return Math.trunc(value * PRECISION) / PRECISION;
}

export function truncateCoordinates({ lat, lng }: Coordinates): Coordinates {
  return { lat: truncateCoordinate(lat), lng: truncateCoordinate(lng) };
}

export function parseCoordinates(lat: string | null | undefined, lng: string | null | undefined): Coordinates | null {
  if (!lat || !lng) return null;
  const parsed = { lat: Number(lat), lng: Number(lng) };
  if (!Number.isFinite(parsed.lat) || !Number.isFinite(parsed.lng)) return null;
  if (Math.abs(parsed.lat) > 90 || Math.abs(parsed.lng) > 180) return null;
  return truncateCoordinates(parsed);
}
