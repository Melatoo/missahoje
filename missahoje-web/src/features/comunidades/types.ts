import type { Timestamps } from '@/types';
import type { Cidade } from '@/features/localizacao/types';
import type { HorarioMissa } from '@/features/missas/types';

export interface Paroquia extends Timestamps {
  id: string;
  nome: string;
  telefone: string | null;
  siteOuRedeSocial: string | null;
  comunidades?: Comunidade[];
}

export interface Comunidade extends Timestamps {
  id: string;
  paroquia_id: string;
  cidade_id: string | null;
  nome: string;
  endereco: string;
  bairro: string;
  link_google_maps: string | null;
  paroquia?: Paroquia;
  cidade?: Cidade;
  horarios_missa?: HorarioMissa[];
}
