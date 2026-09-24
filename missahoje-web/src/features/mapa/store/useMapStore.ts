import { create } from 'zustand';
import type { Coordinates } from '@/features/localizacao/types';
import type { MapBounds } from '../types';

interface MapState {
  center: Coordinates;
  zoom: number;
  bounds: MapBounds | null;

  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds | null) => void;
}

const DEFAULT_CENTER: Coordinates = { lat: -14.235, lng: -51.9253 };
const DEFAULT_ZOOM = 4;

export const useMapStore = create<MapState>((set) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  bounds: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
}));
