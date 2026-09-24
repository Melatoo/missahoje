import type { Comunidade } from '@/features/comunidades/types';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  southWest: Coordinates;
  northEast: Coordinates;
}

export interface MappedComunidade {
  comunidade: Comunidade;
  position: Coordinates;
}
