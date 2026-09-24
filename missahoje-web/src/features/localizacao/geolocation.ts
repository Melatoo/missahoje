import { truncateCoordinates } from './coordinates';
import type { Coordinates } from './types';

export const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 10 * 60 * 1000,
};

export type PositionResult =
  | { status: 'granted'; coordinates: Coordinates }
  | { status: 'denied' }
  | { status: 'unavailable' };

export function getCurrentPosition(geolocation: Geolocation | undefined = globalThis.navigator?.geolocation): Promise<PositionResult> {
  if (!geolocation) return Promise.resolve({ status: 'unavailable' });

  return new Promise((resolve) => {
    geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        status: 'granted',
        coordinates: truncateCoordinates({ lat: coords.latitude, lng: coords.longitude }),
      }),
      (error) => resolve({ status: error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable' }),
      POSITION_OPTIONS,
    );
  });
}
