import type { Timestamps } from '@/types';
import type { Comunidade } from '@/features/comunidades/types';

export interface Cidade extends Timestamps {
  id: string;
  nome: string;
  estado: string;
  slug: string;
  comunidades?: Comunidade[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type PermissionStatus = 'prompt' | 'granted' | 'denied';

export type CidadeSelecionada = Pick<Cidade, 'id' | 'nome' | 'estado' | 'slug'>;

export type OrigemCidade = 'gps' | 'ip' | 'manual';
