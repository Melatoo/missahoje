import type { Timestamps } from '@/types';
import type { Comunidade } from '@/features/comunidades/types';

export interface Cidade extends Timestamps {
  id: string;
  nome: string;
  estado: string;
  slug: string;
  comunidades?: Comunidade[];
}
