import { create } from 'zustand';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type PermissionStatus = 'prompt' | 'granted' | 'denied';

interface MapState {
  center: Coordinates;
  zoom: number;
  bounds: { southWest: Coordinates; northEast: Coordinates } | null;
  userLocation: Coordinates | null;
  permissionStatus: PermissionStatus;

  // Actions
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: { southWest: Coordinates; northEast: Coordinates } | null) => void;
  setUserLocation: (location: Coordinates) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  requestGeolocation: () => void;
}

// Default to a central location (e.g., center of Brazil) if no GPS
const DEFAULT_CENTER: Coordinates = { lat: -14.235, lng: -51.9253 };
const DEFAULT_ZOOM = 4;
const DETAILED_ZOOM = 14;

export const useMapStore = create<MapState>((set) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  bounds: null,
  userLocation: null,
  permissionStatus: 'prompt',

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setUserLocation: (location) => set({ userLocation: location }),
  setPermissionStatus: (status) => set({ permissionStatus: status }),

  requestGeolocation: () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      set({ permissionStatus: 'denied' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        set({
          userLocation: coords,
          center: coords,
          zoom: DETAILED_ZOOM,
          permissionStatus: 'granted',
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message || error);
        set({ permissionStatus: 'denied' });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  },
}));
