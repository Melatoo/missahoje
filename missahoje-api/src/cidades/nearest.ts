export interface Point {
    lat: number;
    lng: number;
}

export interface Located {
    latitude: number | null;
    longitude: number | null;
}

export const MAX_DISTANCE_KM = 30;

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function distanceKm(a: Point, b: Point): number {
    const dLat = toRadians(b.lat - a.lat);
    const dLng = toRadians(b.lng - a.lng);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(a.lat)) *
            Math.cos(toRadians(b.lat)) *
            Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function findNearest<T extends Located>(
    items: T[],
    point: Point,
    maxDistanceKm = MAX_DISTANCE_KM,
): T | null {
    let nearest: T | null = null;
    let nearestDistance = maxDistanceKm;

    for (const item of items) {
        if (item.latitude === null || item.longitude === null) continue;
        const distance = distanceKm(point, {
            lat: item.latitude,
            lng: item.longitude,
        });
        if (distance <= nearestDistance) {
            nearest = item;
            nearestDistance = distance;
        }
    }

    return nearest;
}
