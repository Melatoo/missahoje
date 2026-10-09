import type { Schemas } from '@/types';

export type Cidade = Schemas['CidadeDto'];

export interface Coordinates {
  lat: number;
  lng: number;
}

export type PermissionStatus = 'prompt' | 'granted' | 'denied';

export type CidadeSelecionada = Pick<Cidade, 'id' | 'nome' | 'estado' | 'slug'>;

export type OrigemCidade = 'gps' | 'ip' | 'manual';

export type LinkCityStatus = 'pending' | 'error' | null;

export interface Locating {
  explicit: boolean;
  startedAt: number;
  coordinates: Coordinates | null;
}

export type LocationFeedback = 'denied' | 'unavailable' | 'not-found' | 'error';
