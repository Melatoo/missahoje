import { truncateCoordinates } from './coordinates';
import type { Coordinates, PermissionStatus } from './types';

export const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 10 * 60 * 1000,
};

export type PositionResult =
  | { status: 'granted'; coordinates: Coordinates }
  | { status: 'denied' }
  | { status: 'unavailable' };

export function isGeolocationAvailable(scope: typeof globalThis = globalThis): boolean {
  return scope.isSecureContext !== false && Boolean(scope.navigator?.geolocation);
}

export function watchPermission(
  listener: (status: PermissionStatus) => void,
  permissions: Permissions | undefined = globalThis.navigator?.permissions,
): () => void {
  if (!permissions?.query) return () => {};

  let active = true;
  let permission: globalThis.PermissionStatus | null = null;
  const notify = () => {
    if (active && permission) listener(permission.state);
  };

  permissions
    .query({ name: 'geolocation' })
    .then((result) => {
      if (!active) return;
      permission = result;
      notify();
      result.addEventListener('change', notify);
    })
    .catch(() => {});

  return () => {
    active = false;
    permission?.removeEventListener('change', notify);
  };
}

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
