import type { Comunidade } from '@/features/comunidades/types';
import type { Coordinates } from '@/features/localizacao/types';

export interface MapBounds {
  southWest: Coordinates;
  northEast: Coordinates;
}

export interface MappedComunidade {
  comunidade: Comunidade;
  position: Coordinates;
}
