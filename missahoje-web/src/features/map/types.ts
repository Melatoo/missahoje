import { Coordinates } from './store/useMapStore';

export interface MapBounds {
  southWest: Coordinates;
  northEast: Coordinates;
}

export interface Parish {
  id: string;
  name: string;
  location: Coordinates;
  distance?: number;
  tags?: string[];
  nextMassTime?: string;
  hasParking?: boolean;
  isAccessible?: boolean;
}
